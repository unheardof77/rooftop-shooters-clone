import { Body, Vec2 } from "planck";
import { PhysicsState } from "../utils/types";
import { world } from "../engine/world";

class PhysicsInterpolator {
    private accumulator: number = 0;
    private readonly fixedTimeStep: number = 1/60; // 60 FPS physics
    private previousStates: Map<Body, PhysicsState> = new Map();
    private currentStates: Map<Body, PhysicsState> = new Map();
    private interpolationAlpha: number = 0;
    
    // Store complete physics state

    
    // Update physics at fixed timestep
    updatePhysics(deltaTime: number): void {
        this.accumulator += deltaTime;
        
        // Store previous state before physics step
        this.storeCurrentStates();
        
        // Run physics at fixed timestep
        while (this.accumulator >= this.fixedTimeStep) {
            this.stepPhysics();
            this.accumulator -= this.fixedTimeStep;
        }
        
        // Calculate interpolation factor
        this.interpolationAlpha = this.accumulator / this.fixedTimeStep;
    }
    
    private stepPhysics(): void {
        // Run one physics step
        world.step(this.fixedTimeStep);
        
        // Update current states after physics step
        this.updateCurrentStates();
    }
    
    private storeCurrentStates(): void {
        this.previousStates.clear();
        this.currentStates.forEach((state, body) => {
            this.previousStates.set(body, { ...state });
        });
    }
    
    private updateCurrentStates(): void {
        this.currentStates.clear();
        let body = world.getBodyList();
        while (body) {
            this.currentStates.set(body, {
                position: body.getPosition().clone(),
                angle: body.getAngle(),
                linearVelocity: body.getLinearVelocity().clone(),
                angularVelocity: body.getAngularVelocity(),
                timestamp: performance.now()
            });
            body = body.getNext();
        }
    }
    
    // Get interpolated state for rendering
    getInterpolatedState(body: Body): PhysicsState | null {
        const current = this.currentStates.get(body);
        const previous = this.previousStates.get(body);
        
        if (!current) return null;
        if (!previous) return current;
        
        return {
            position: this.lerpVec2(previous.position, current.position, this.interpolationAlpha),
            angle: this.lerpAngle(previous.angle, current.angle, this.interpolationAlpha),
            linearVelocity: this.lerpVec2(previous.linearVelocity, current.linearVelocity, this.interpolationAlpha),
            angularVelocity: this.lerp(previous.angularVelocity, current.angularVelocity, this.interpolationAlpha),
            timestamp: current.timestamp
        };
    }
    
    // Linear interpolation for vectors
    private lerpVec2(a: Vec2, b: Vec2, alpha: number): Vec2 {
        return new Vec2(
            a.x + (b.x - a.x) * alpha,
            a.y + (b.y - a.y) * alpha
        );
    }
    
    // Angular interpolation (handles angle wrapping)
    private lerpAngle(a: number, b: number, alpha: number): number {
        let diff = b - a;
        
        // Handle angle wrapping
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        
        return a + diff * alpha;
    }
    
    // Linear interpolation for scalars
    private lerp(a: number, b: number, alpha: number): number {
        return a + (b - a) * alpha;
    }
}

export default PhysicsInterpolator