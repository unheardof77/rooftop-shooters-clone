import { fireProjectile } from "../entities/entityUtils/projectileUtils";
import {world} from "../engine/world";
import { toCanvas } from "../utils/scale";
import { drawProjectile } from "../utils/drawutils";
import { ProjectileSystem } from "../utils/types";
import { CANVAS } from "../utils/constants";



export function projectileSystem({
    prevKeysRef, 
    keysRef, 
    blueArm, 
    blueCharacter, 
    redArm, 
    redCharacter, 
    projectilesRef, 
    ctx,
    spatialGrid // NEW: Optional spatial grid parameter
}: ProjectileSystem) {
    //fire bullet if it is right after releasing key
    if (prevKeysRef.current.e && !keysRef.current.e) {
        fireProjectile(blueArm, blueCharacter, projectilesRef.current);
    }
    if (prevKeysRef.current.o && !keysRef.current.o) {
        fireProjectile(redArm, redCharacter, projectilesRef.current);
    }
    //store current keys for next frame compare
    prevKeysRef.current = { ...keysRef.current };
    //draw and remove projectiles
    projectilesRef.current.forEach((projectile, index) => {
        const pos = toCanvas(projectile.getPosition());
        drawProjectile(ctx, pos);
        
        // NEW: Use spatial partitioning for collision detection if available
        if (spatialGrid) {
            const nearbyObjects = spatialGrid.getNearbyObjects(projectile, 20);
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
            projectilesRef.current.splice(index, 1);
        }
        // Remove projectiles that go off-screen
        if (pos.y < -CANVAS.height || pos.y > CANVAS.height || pos.x < 0 || pos.x > CANVAS.width) {
            world.destroyBody(projectile);
            projectilesRef.current.splice(index, 1);
        }
    });
}