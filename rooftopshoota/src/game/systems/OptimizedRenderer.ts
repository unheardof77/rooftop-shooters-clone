// NEW FILE: Core rendering optimization system
// This class manages dirty rectangle rendering to avoid clearing the entire canvas every frame
export class OptimizedRenderer {
    // Canvas rendering context for drawing operations
    private ctx: CanvasRenderingContext2D;
    // Reference to the HTML canvas element
    private canvas: HTMLCanvasElement;
    // Array of rectangular regions that need to be redrawn (dirty regions)
    private dirtyRegions: Array<{x: number, y: number, width: number, height: number}> = [];
    // Map to track object positions from the previous frame for dirty region calculation
    private lastFrameObjects: Map<string, {x: number, y: number, width: number, height: number}> = new Map();
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Get the 2D rendering context from the canvas (the ! tells TypeScript this won't be null)
        this.ctx = canvas.getContext('2d')!;
    }
    
    // Mark a rectangular region as needing to be redrawn
    markDirty(x: number, y: number, width: number, height: number): void {
        // Add the region coordinates to the dirty regions array
        this.dirtyRegions.push({x, y, width, height});
    }
    
    // Clear only the regions that have changed instead of the entire canvas
    clearDirtyRegions(): void {
        // If no regions are dirty, clear the entire canvas (fallback behavior)
        if (this.dirtyRegions.length === 0) {
            this.ctx.fillStyle = "lightyellow";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        // Set the background color for clearing
        this.ctx.fillStyle = "lightyellow";
        // Clear each dirty region individually (much faster than clearing entire canvas)
        this.dirtyRegions.forEach(region => {
            this.ctx.fillRect(region.x, region.y, region.width, region.height);
        });
        
        // Reset the dirty regions array for the next frame
        this.dirtyRegions = [];
    }
    
    // Track an object's position to calculate dirty regions between frames
    trackObject(id: string, x: number, y: number, width: number, height: number): void {
        // Get the object's position from the previous frame
        const lastPos = this.lastFrameObjects.get(id);
        if (lastPos) {
            // Mark the old position as dirty (needs to be cleared)
            this.markDirty(lastPos.x, lastPos.y, lastPos.width, lastPos.height);
        }
        // Mark the new position as dirty (needs to be redrawn)
        this.markDirty(x, y, width, height);
        // Store the current position for the next frame comparison
        this.lastFrameObjects.set(id, {x, y, width, height});
    }
}