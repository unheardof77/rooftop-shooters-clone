// NEW FILE: Optimized drawing utilities
// This class provides optimized drawing methods that reduce canvas state changes and improve performance
import { PosCords } from '../utils/types';
import { CHARACTER, METER, ARM, CANVAS } from '../utils/constants';
import { toCanvas, toCanvasDimensions } from '../utils/scale';
import { Box, Body } from 'planck';

export class OptimizedDrawUtils {
    // Canvas rendering context for drawing operations
    private ctx: CanvasRenderingContext2D;
    
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    
    
    // Draw multiple characters efficiently by grouping them by color
    drawCharacters(characters: Array<{pos: PosCords, angle: number, color: string}>): void {
        // Group characters by color to minimize fillStyle changes
        const colorGroups = new Map<string, Array<{pos: PosCords, angle: number}>>();
        
        // Sort characters into color groups
        characters.forEach(char => {
            // Create new color group if it doesn't exist
            if (!colorGroups.has(char.color)) {
                colorGroups.set(char.color, []);
            }
            // Add character to its color group
            colorGroups.get(char.color)!.push({pos: char.pos, angle: char.angle});
        });
        
        // Draw all characters of the same color together
        colorGroups.forEach((chars, color) => {
            chars.forEach(char => {
                this.drawCharacterOptimized(char.pos, char.angle, color);
            });
        });
    }
    
    // Draw a single character with optimized rendering
    public drawCharacterOptimized(pos: PosCords, angle: number, color: string): void {
        // Save current canvas state (transform, fillStyle, etc.)
        this.ctx.save();
        // Move origin to character position
        this.ctx.translate(pos.x, pos.y);
        // Rotate canvas by character's physics angle
        this.ctx.rotate(angle);
        
        // Draw circular base of character
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        // Draw circle with radius converted from physics units to pixels
        this.ctx.arc(0, 0, CHARACTER.radius * METER, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw rectangular body of character
        // Calculate body height (total height minus circular base)
        const bodyHeight = (CHARACTER.height - CHARACTER.radius) * METER;
        // Draw rectangle positioned above the circular base
        this.ctx.fillRect(
            -CHARACTER.width / 2 * METER,  // Left edge (negative half width)
            -CHARACTER.radius * METER,     // Top edge (negative radius)
            CHARACTER.width * METER,       // Width in pixels
            -bodyHeight                    // Height (negative to go upward)
        );
        
        // Draw yellow indicator dot at the top of character
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(-5, -CHARACTER.height * METER + 10, 10, 10);
        
        // Restore canvas state to previous values
        this.ctx.restore();
    }
    
    // Draw the stage (platform) with optimized rendering
    drawStageOptimized(stage: Body, ctx: CanvasRenderingContext2D): void {
        // Convert stage position from physics coordinates to canvas coordinates
        const scC = toCanvas(stage.getPosition());
        // Get the first fixture (collision shape) of the stage
        const fix = stage.getFixtureList();
        
        if (fix) {
            // Get the shape of the fixture
            const shape = fix.getShape();
            // Check if it's a polygon (box) shape
            if (shape?.getType() === 'polygon') {
                // Cast to Box type to access box-specific properties
                const boxShape = shape as Box;
                // Get half-width and half-height from the first vertex
                const hwP = Math.abs(boxShape.m_vertices[0].x);
                const hhP = Math.abs(boxShape.m_vertices[0].y);
                // Convert physics dimensions to canvas dimensions
                const cwC = toCanvasDimensions(hwP);
                const chC = toCanvasDimensions(hhP);
                
                // Draw the stage as a grey rectangle
                ctx.fillStyle = 'grey';
                // Position rectangle centered on stage position
                ctx.fillRect(scC.x - cwC / 2, scC.y - chC / 2, cwC, chC);
            }
        }
    }

    // Draw multiple arms efficiently by grouping them by color
    drawArms(arms: Array<{pos: PosCords, angle: number, color: string}>): void {
        // Group arms by color for optimization
        const colorGroups = new Map<string, Array<{pos: PosCords, angle: number}>>();
        
        // Sort arms into color groups
        arms.forEach(arm => {
            if (!colorGroups.has(arm.color)) {
                colorGroups.set(arm.color, []);
            }
            colorGroups.get(arm.color)!.push({
                pos: arm.pos, 
                angle: arm.angle
            });
        });
        
        // Draw all arms of the same color together
        colorGroups.forEach((armGroup, color) => {
            armGroup.forEach(arm => {
                this.drawSingleArmOptimized(arm.pos, arm.angle, color);
            });
        });
    }

    // Draw a single arm with optimized rendering
    private drawSingleArmOptimized(pos: PosCords, angle: number, color: string): void {
        // Save current canvas state
        this.ctx.save();
        
        // Move origin to arm position
        this.ctx.translate(pos.x, pos.y);
        
        // Rotate canvas by arm's physics angle
        this.ctx.rotate(angle);
        
        // Set arm color
        this.ctx.fillStyle = color;
        
        // Draw arm as a rectangle
        // Convert physics dimensions to canvas pixels
        const armWidthPixels =  ARM.width*METER;
        const armHeightPixels = (ARM.height*METER)   
        
        // Position rectangle so it extends downward from the attachment point
        // (following the pattern from Arm.ts where arms extend DOWNWARD)
        this.ctx.fillRect(
            -armWidthPixels / 2,  // Center horizontally
            0,                    // Start at attachment point
            armWidthPixels,       // Width in pixels
            armHeightPixels       // Height extending downward
        );
        
        // Optional: Add visual details like a gun tip or joint indicator
        this.drawArmDetails(armWidthPixels, armHeightPixels);
        
        // Restore canvas state
        this.ctx.restore();
    }

    // Add visual details to the arm
    private drawArmDetails(widthPixels: number, heightPixels: number): void {
        // Draw gun tip at the end of the arm
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(
            -widthPixels / 2 - 2,
            heightPixels - 5,
            widthPixels + 4,
            5
        );
        
        // Draw joint indicator at the top
        this.ctx.fillStyle = 'darkgrey';
        this.ctx.fillRect(
            -widthPixels / 2 - 3,
            -3,
            widthPixels + 6,
            6
        );
    }
}
