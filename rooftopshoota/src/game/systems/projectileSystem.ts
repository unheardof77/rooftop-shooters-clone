import { fireProjectile } from "../entities/entityUtils/projectileUtils";
import {world} from "../engine/world";
import { toCanvas } from "../utils/scale";
import { drawProjectile } from "../utils/drawutils";
import { ProjectileSystem } from "../utils/types";
import { CANVAS } from "../utils/constants";



export function projectileSystem({prevKeysRef, keysRef, blueArm, blueCharacter, redArm, redCharacter, projectilesRef, ctx}:ProjectileSystem) {
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

        // Remove projectiles that go off-screen
        if (pos.y < -CANVAS.height || pos.y > CANVAS.height || pos.x < 0 || pos.x > CANVAS.width) {
            world.destroyBody(projectile);
            projectilesRef.current.splice(index, 1);
        }
    });
}