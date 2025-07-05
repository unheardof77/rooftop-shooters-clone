import { CHARACTER_SHAPE, ARM_SHAPE, PROJECTILE_SHAPE } from '../utils/shapeConstants';
import { METER } from '../utils/constants';
import { PosCords } from '../utils/types';

// This class manages dirty rectangle rendering to avoid clearing the entire canvas every frame
export class OptimizedRenderer {

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    // Array of rectangular regions that need to be redrawn (dirty regions)
    private dirtyRegions: Array<{ x: number, y: number, width: number, height: number, isCircle?: boolean }> = [];
    // Map to track object positions from the previous frame for dirty region calculation
    private lastFrameObjects: Map<string, { x: number, y: number, width: number, height: number, isCircle?: boolean }> = new Map();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Get the 2D rendering context from the canvas (the ! tells TypeScript this won't be null)
        this.ctx = canvas.getContext('2d')!;
    }

    // Mark a rectangular region as needing to be redrawn
    markDirty(x: number, y: number, width: number, height: number, isCircle?: boolean): void {
        // Add the region coordinates to the dirty regions array
        this.dirtyRegions.push({ x, y, width, height, isCircle });
    }

    // Clear only the regions that have changed instead of the entire canvas
    clearDirtyRegions(): void {
        // If no regions are dirty, clear the entire canvas (fallback behavior)
        if (this.dirtyRegions.length === 0) {
            this.ctx.fillStyle = "lightyellow";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            console.log('Falling back to full canvas clear');
            return;
        }

        // Set the background color for clearing
        this.ctx.fillStyle = "lightyellow";
        // Clear each dirty region individually (much faster than clearing entire canvas)
        this.dirtyRegions.forEach(region => {
            if (region.isCircle) {
                this.ctx.beginPath();
                this.ctx.arc(region.x, region.y, region.width, 0, 2 * Math.PI);
                this.ctx.fill();
                // Draw outline for circle dirty region
                // this.ctx.strokeStyle = "black";
                // this.ctx.lineWidth = 1;
                // this.ctx.beginPath();
                // this.ctx.arc(region.x, region.y, region.width, 0, 2 * Math.PI);
                // this.ctx.stroke();
            } else {
                this.ctx.fillRect(
                    region.x - region.width / 2,
                    region.y - region.height / 2,
                    region.width,
                    region.height
                );
                // // Draw outline
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(
                    region.x - region.width / 2,
                    region.y - region.height / 2,
                    region.width,
                    region.height
                );
                // // Draw '0' at true bottom-left
                // this.ctx.save();
                // this.ctx.fillStyle = "lime";
                // this.ctx.font = "bold 14px Arial";
                // this.ctx.textBaseline = "bottom";
                // this.ctx.textAlign = "left";
                // this.ctx.fillText(
                //     "0",
                //     region.x - region.width / 2,
                //     region.y + region.height / 2
                // );
                // this.ctx.restore();
            }
        });

        // Reset the dirty regions array for the next frame
        this.dirtyRegions = [];
    }

    // Track an object's position to calculate dirty regions between frames
    trackObject(id: string, { x, y }: PosCords, angle: number): void {
        let width: number;
        let height: number;
        let isCircle: boolean = false;
        let radius: number = 0;
        const specificId = id.split('_')[0];

        switch (specificId) {
            case 'body':
                // For character body, position dirty region to cover the entire character
                // The circular base is at the character's position, and the rectangle extends upward
                width = CHARACTER_SHAPE.width * METER;
                height = CHARACTER_SHAPE.height * METER;
                // Position dirty region so it covers from the bottom of the circle to the top of the rectangle
                // The dirty region should be centered horizontally but extend from the circle center upward
                y = y - CHARACTER_SHAPE.height * METER / 2;
                break;
            case 'arm':
                width = ARM_SHAPE.width * METER;
                height = ARM_SHAPE.height * METER;
                break;
            case 'projectile':
                width = PROJECTILE_SHAPE.radius * METER;
                height = PROJECTILE_SHAPE.radius * METER;
                isCircle = true;
                radius = PROJECTILE_SHAPE.radius * METER;
                break;
            case 'lowerBody':
                isCircle = true;
                radius = CHARACTER_SHAPE.radius * METER;
                width = radius;
                height = radius;
                break;
            default:
                console.log('Unknown object type:', id);
                width = 0;
                height = 0;
                return;
        }
        let lastPos: { x: number, y: number, width: number, height: number, isCircle?: boolean } | undefined;
        if (isCircle) {
            // Always center the dirty region on the actual draw position
            const circleCenter = { x, y };
            lastPos = this.lastFrameObjects.get(id);
            if (lastPos) {
                this.markDirty(lastPos.x, lastPos.y, lastPos.width, lastPos.height, true);
            }
            this.markDirty(circleCenter.x, circleCenter.y, radius, radius, true);
            this.lastFrameObjects.set(id, {
                x: circleCenter.x,
                y: circleCenter.y,
                width: radius,
                height: radius,
                isCircle
            });
        } else {
            // Calculate the axis-aligned bounding box (AABB) for the rotated rectangle
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const halfW = width / 2;
            const halfH = height / 2;
            // Get the four corners after rotation
            const corners = [
                { x: -halfW, y: -halfH },
                { x: halfW, y: -halfH },
                { x: halfW, y: halfH },
                { x: -halfW, y: halfH }
            ].map(pt => {
                return {
                    x: x + pt.x * cos - pt.y * sin,
                    y: y + pt.x * sin + pt.y * cos
                };
            });
            // Find AABB
            const xs = corners.map(pt => pt.x);
            const ys = corners.map(pt => pt.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const aabbX = (minX + maxX) / 2;
            const aabbY = (minY + maxY) / 2;
            const aabbW = maxX - minX;
            const aabbH = maxY - minY;

            // Use AABB for dirty region tracking
            lastPos = this.lastFrameObjects.get(id);
            if (lastPos) {
                this.markDirty(lastPos.x, lastPos.y, lastPos.width, lastPos.height, false);
            }
            this.markDirty(aabbX, aabbY, aabbW, aabbH, false);
            this.lastFrameObjects.set(id, {
                x: aabbX,
                y: aabbY,
                width: aabbW,
                height: aabbH,
                isCircle: false
            });
        }
    }
}