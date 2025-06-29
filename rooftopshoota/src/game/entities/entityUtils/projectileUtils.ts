import { Body, Vec2 } from 'planck';
import { ARM_LENGTH, PROJECTILE_SPEED } from '@/game/utils/constants';
import { createProjectile } from '../Projectile';

export const fireProjectile = (arm: Body, character: Body, projectilesRef:Body[]) => {
    // Get arm end position (tip of the arm)
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
    projectilesRef.push(projectile);

    // Apply recoil to character
    const recoilDirection = new Vec2(
        Math.sin(armAngle) * PROJECTILE_SPEED * 0.5,
        Math.cos(armAngle) * PROJECTILE_SPEED * 0.5
    );
    character.applyLinearImpulse(recoilDirection, character.getWorldCenter());
};