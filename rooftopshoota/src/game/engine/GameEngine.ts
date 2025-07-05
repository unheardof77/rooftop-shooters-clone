import PhysicsInterpolator from "./PhysicsInterpolator";
import SpatialPartitioningGrid from "./SpatialPartitioningGrid";
import { FrameRateController } from "../systems/Controllers/FrameRateController";
import { GameStatus, Keys, MountInputSystem, WorldBounds } from "../utils/types";
import { CANVAS } from "../utils/constants";
import { world } from "./world";
import { Body } from "planck";
import ProjectileSystem from "../systems/ProjectileSystem";
import InputSystem from "../systems/InputSystem";


export class GameEngine {
    private physicsInterpolator: PhysicsInterpolator;
    private spatialGrid: SpatialPartitioningGrid;
    private frameController: FrameRateController;
    private projectileSystem: ProjectileSystem;
    private inputSystem: InputSystem | null;
    private lastTime: number = 0;
    
    constructor() {
        this.physicsInterpolator = new PhysicsInterpolator();
        const worldBounds: WorldBounds = {
            minX: 0, maxX: CANVAS.width,
            minY: 0, maxY: CANVAS.height
        };
        this.spatialGrid = new SpatialPartitioningGrid(100, worldBounds);
        this.frameController = new FrameRateController(60);
        this.projectileSystem = new ProjectileSystem(this.spatialGrid);
        this.inputSystem = null;
    }

    mountInputSystem({keysRef, prevKeysRef, setGameStatus, blueJoint, redJoint}:MountInputSystem){
        this.inputSystem = new InputSystem(keysRef, prevKeysRef, blueJoint, redJoint);
        return this.inputSystem.initialize({setGameStatus});
    }

    mountEventListeners(canBlueJump: () => boolean, canRedJump: () => boolean, blueCharacter: Body, redCharacter: Body, blueArm: Body, redArm: Body){
        this.inputSystem?.handleCharacterJump(canBlueJump, canRedJump, blueCharacter, redCharacter);
        this.inputSystem?.handleArmMotorControl();
        this.inputSystem?.handleProjectileFire(blueArm, redArm, blueCharacter, redCharacter, this.projectileSystem.fireProjectile.bind(this.projectileSystem));
    }
    
    // Main update method called from game loop
    update(currentTime: number, gameStatus: GameStatus) {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Handle physics at fixed timestep
        if (gameStatus.gameStatus === "playing") {
            this.physicsInterpolator.updatePhysics(deltaTime);
        }else {
            console.log("skipping physics update");
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

    // Get projectile system for rendering and updates
    getProjectileSystem() {
        return this.projectileSystem;
    }
} 