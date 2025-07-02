import PhysicsInterpolator from "../engine/PhysicsInterpolator";
import SpatialPartitioningGrid from "../engine/SpatialPartitioningGrid";
import { FrameRateController } from "./FrameRateController";
import { GameStatus } from "../utils/types";
import { CANVAS } from "../utils/constants";
import { world } from "../engine/world";
import { Body } from "planck";

// NEW: Centralized game loop management
export class OptimizedGameLoop {
    private physicsInterpolator: PhysicsInterpolator;
    private spatialGrid: SpatialPartitioningGrid;
    private frameController: FrameRateController;
    private lastTime: number = 0;
    
    constructor() {
        this.physicsInterpolator = new PhysicsInterpolator();
        this.spatialGrid = new SpatialPartitioningGrid(100, {
            minX: 0, maxX: CANVAS.width,
            minY: 0, maxY: CANVAS.height
        });
        this.frameController = new FrameRateController(60);
    }
    
    // Main update method called from game loop
    update(currentTime: number, gameStatus: GameStatus) {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Handle physics at fixed timestep
        if (gameStatus.gameStatus === "playing") {
            this.physicsInterpolator.updatePhysics(deltaTime);
        }
        
        // Update spatial partitioning
        this.updateSpatialPartitioning();
        
        return {
            physicsInterpolator: this.physicsInterpolator,
            spatialGrid: this.spatialGrid,
            frameController: this.frameController
        };
    }
    
    private updateSpatialPartitioning() {
        // Update all physics objects in spatial grid
        let body = world.getBodyList();
        while (body) {
            this.spatialGrid.updateObject(body);
            body = body.getNext();
        }
    }
    
    // Get interpolated state for rendering
    getInterpolatedState(body: Body) {
        return this.physicsInterpolator.getInterpolatedState(body);
    }
    
    // Get nearby objects for collision detection
    getNearbyObjects(body: Body, radius: number = 20) {
        return this.spatialGrid.getNearbyObjects(body, radius);
    }
    
    // Check projectile collisions using spatial partitioning
    checkProjectileCollisions(projectile: Body) {
        return this.spatialGrid.checkProjectileCollisions(projectile);
    }
    
    // Cleanup when objects are destroyed
    removeObject(body: Body) {
        this.spatialGrid.removeObject(body);
    }
}
