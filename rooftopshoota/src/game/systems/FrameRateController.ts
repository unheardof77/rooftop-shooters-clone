// NEW FILE: Frame rate management system
// This class controls the game's frame rate to ensure consistent performance across different devices
export class FrameRateController {
    // Target frames per second (default 60 FPS for smooth gameplay)
    private targetFPS: number = 60;
    // Time in milliseconds between frames (1000ms / 60fps = ~16.67ms per frame)
    private frameTime: number = 1000 / 60;
    // Timestamp of the last frame that was rendered
    private lastFrameTime: number = 0;
    // Counter for tracking actual frames rendered (for FPS monitoring)
    private frameCount: number = 0;
    
    constructor(targetFPS: number = 60) {
        // Set the target frame rate
        this.targetFPS = targetFPS;
        // Calculate the time interval between frames in milliseconds
        this.frameTime = 1000 / targetFPS;
    }
    
    // Determine if we should render a new frame based on target frame rate
    shouldRender(currentTime: number): boolean {
        // Check if enough time has passed since the last frame
        if (currentTime - this.lastFrameTime >= this.frameTime) {
            // Update the last frame time to current time
            this.lastFrameTime = currentTime;
            // Increment frame counter for FPS tracking
            this.frameCount++;
            // Allow rendering this frame
            return true;
        }
        // Skip this frame to maintain target frame rate
        return false;
    }
    
    // Get the current frame count (for FPS calculation)
    getFPS(): number {
        return this.frameCount;
    }
    
    // Reset the frame counter (call this every second for accurate FPS measurement)
    resetFrameCount(): void {
        this.frameCount = 0;
    }
}
