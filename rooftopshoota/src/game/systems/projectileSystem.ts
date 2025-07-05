import {world} from "../engine/world";
import { toCanvas } from "../utils/scale";
import { Body, Vec2 } from "planck";

import { ARM_LENGTH, CANVAS, PROJECTILE_KNOCKBACK, PROJECTILE_SPEED } from "../utils/constants";
import SpatialPartitioningGrid from "../engine/SpatialPartitioningGrid";
import { OptimizedRenderer } from "./OptimizedRenderer";
import { RenderCuller } from "./RenderCuller";
import { createProjectile } from "../entities/Projectile";
import { OptimizedDrawUtils } from "./OptimizedDrawUtils";

export default class ProjectileSystem {
    private projectiles: Body[] = [];
    private spatialGrid: SpatialPartitioningGrid | null;
    constructor(spatialGrid: SpatialPartitioningGrid) {
        this.spatialGrid = spatialGrid;
        this.projectiles = [];
    }
    fireProjectile(arm: Body, character: Body) {
        const armAngle = arm.getAngle();
        const armPos = arm.getPosition();

        // Calculate projectile spawn position (end of arm)
        const offset = new Vec2(
        Math.sin(armAngle) * -ARM_LENGTH, // Negative for downward arm
        Math.cos(armAngle) * -ARM_LENGTH
        );
        const spawnPos = Vec2.add(armPos, offset);

        // Create projectile
        const projectile = createProjectile(spawnPos.x, spawnPos.y, armAngle);
        this.projectiles.push(projectile);
        const recoilDirection = new Vec2(
            Math.sin(armAngle) * PROJECTILE_SPEED * PROJECTILE_KNOCKBACK,
            Math.cos(armAngle) * PROJECTILE_SPEED * PROJECTILE_KNOCKBACK
        );
        character.applyLinearImpulse(recoilDirection, character.getWorldCenter());
        arm.applyLinearImpulse(recoilDirection, arm.getWorldCenter());
    }
    update() {

    //draw and remove projectiles
        const projectilesToRemove: number[] = [];
        this.projectiles.forEach((projectile, index) => {
            const pos = toCanvas(projectile.getPosition());


            // NEW: Use spatial partitioning for collision detection if available
            if (this.spatialGrid) {
                const nearbyObjects = this.spatialGrid.getNearbyObjects(projectile, 20);
                const hasCollision = nearbyObjects.some((obj:any) => {
                    // Quick collision check with nearby objects only
                    const objPos = obj.getPosition();
                    const distance = Math.sqrt((pos.x - objPos.x) ** 2 + (pos.y - objPos.y) ** 2);
                    return distance < 30; // Collision radius
                });

                if (hasCollision) {
                    projectile.setUserData({ shouldRemove: true });
                }
            }

            // Existing removal logic
            const userData = projectile.getUserData() as { shouldRemove?: boolean };
            if(userData?.shouldRemove){
                world.destroyBody(projectile);
                projectilesToRemove.push(index);
            }
            // Remove projectiles that go off-screen (using physics coordinates)
            const physicsPos = projectile.getPosition();
            if (physicsPos.y < -50 || physicsPos.y > 50 || physicsPos.x < -50 || physicsPos.x > 50) {
                world.destroyBody(projectile);
                projectilesToRemove.push(index);
            }
        });
        // Remove in reverse order to maintain indices
        projectilesToRemove.reverse().forEach(index => {
            this.projectiles.splice(index, 1);
        });
    }
    
    // Update projectiles and track them for dirty region management
    updateAndTrackAndDraw(renderer: OptimizedRenderer, culler: RenderCuller, drawUtils: OptimizedDrawUtils) {
        // Update projectiles (remove off-screen ones, check collisions)
        this.update();
        
        // Track projectiles for dirty region management
        this.projectiles.forEach((projectile, index) => {
            const pos = toCanvas(projectile.getPosition());
            const radius = 5; // Projectile radius in pixels
            
            // Only track if projectile is visible
            if (culler.isVisible(pos.x - radius, pos.y - radius, radius * 2, radius * 2)) {
                renderer.trackObject(`projectile_${index}`, pos, 0);
                drawUtils.drawProjectile(pos);
            }
        });
    }

    // Get all projectiles for rendering
    getProjectiles(): Body[] {
        return this.projectiles;
    }
    removeProjectile(index: number) {
        world.destroyBody(this.projectiles[index]);
        this.projectiles.splice(index, 1);
    }
}
