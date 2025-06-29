import { Circle, Vec2 } from 'planck';
import { world } from '../engine/world';
import { PROJECTILE_RADIUS, PROJECTILE_SPEED } from '../utils/constants';

export const createProjectile = (x: number, y: number, angle: number) => {
    const projectile = world.createBody({
        type: 'dynamic',
        position: new Vec2(x, y),
        bullet: true, // Enable continuous collision detection
        fixedRotation: true
    });
    
    projectile.createFixture(new Circle(PROJECTILE_RADIUS), {
        density: 0.1,
        restitution: 0.8,
        userData: { type: 'projectile' }
    });
    
    // Calculate direction vector from angle
    const direction = new Vec2(
        Math.sin(angle),
        Math.cos(angle)
    );
    
    // Set initial velocity
    projectile.setLinearVelocity(direction.mul(-PROJECTILE_SPEED));
    
    return projectile;
};