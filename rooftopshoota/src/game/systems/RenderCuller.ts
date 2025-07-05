// NEW FILE: Viewport culling system
// This class prevents rendering objects that are outside the visible area to improve performance
import { Body } from 'planck';
import { toCanvas } from '../utils/scale';
import { PROJECTILE_RADIUS, METER } from '../utils/constants';
import { OptimizedRenderer } from './OptimizedRenderer';
import { PosCords } from '../utils/types';

export class RenderCuller {
    // Defines the visible area of the canvas (viewport bounds)
    private viewport: {x: number, y: number, width: number, height: number};
    // Extra margin around viewport to prevent popping when objects enter/exit screen
    private margin: number = 100;
    
    constructor(canvasWidth: number, canvasHeight: number) {
        // Initialize viewport to cover the entire canvas
        this.viewport = {x: 0, y: 0, width: canvasWidth, height: canvasHeight};
    }
    
    // Check if a rectangular area is visible within the viewport (with margin)
    isVisible(x: number, y: number, width: number, height: number): boolean {
        // Return true if the object is NOT completely outside the viewport
        // The logic checks if object is outside any edge of the viewport + margin
        return !(
            // Object is too far left
            x + width < this.viewport.x - this.margin ||
            // Object is too far right
            x > this.viewport.x + this.viewport.width + this.margin ||
            // Object is too far up
            y + height < this.viewport.y - this.margin ||
            // Object is too far down
            y > this.viewport.y + this.viewport.height + this.margin
        );
    }
    
    // Render only projectiles that are visible on screen
    renderProjectiles(
        projectiles: Body[], 
        ctx: CanvasRenderingContext2D,
        renderer: OptimizedRenderer
    ): void {
        // Loop through each projectile in the physics world
        projectiles.forEach((projectile, index) => {
            // Convert physics position to canvas coordinates
            const pos = toCanvas(projectile.getPosition());
            // Calculate projectile radius in canvas pixels
            const radius = PROJECTILE_RADIUS * METER;
            
            // Only render if projectile is visible (within viewport + margin)
            if (this.isVisible(pos.x - radius, pos.y - radius, radius * 2, radius * 2)) {
                // Track the projectile for dirty region management
                renderer.trackObject(`projectile_${index}`, pos, 0);
                // Draw the projectile
                this.drawProjectileOptimized(ctx, pos);
            }
            // If projectile is not visible, skip rendering entirely (performance gain)
        });
    }
    
    // Optimized projectile drawing without save/restore for better performance
    private drawProjectileOptimized(ctx: CanvasRenderingContext2D, pos: PosCords): void {
        // Set projectile color
        ctx.fillStyle = 'red';
        // Start drawing a circle
        ctx.beginPath();
        // Draw circle at projectile position with calculated radius
        ctx.arc(pos.x, pos.y, PROJECTILE_RADIUS * METER, 0, Math.PI * 2);
        // Fill the circle
        ctx.fill();
    }
}
