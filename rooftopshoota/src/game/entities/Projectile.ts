import { Circle, Vec2 } from 'planck';
import { world } from '../engine/world';
import { PROJECTILE } from '../utils/constants';
import { PROJECTILE_CATEGORY, PROJECTILE_MASK } from '../utils/collisionGroups';

export const createProjectile = (x: number, y: number, angle: number) => {
    const projectile = world.createBody({
        type: 'dynamic',
        position: new Vec2(x, y),
        bullet: true, // Enable continuous collision detection
        fixedRotation: true
    });
    
    projectile.createFixture(new Circle(PROJECTILE.radius), {
        density: PROJECTILE.density,
        restitution: PROJECTILE.restitution,
        filterCategoryBits: PROJECTILE_CATEGORY, // Projectile category
        filterMaskBits: PROJECTILE_MASK, // Collide with character/ground
        userData: { type: 'projectile' }
    });
    
    // Calculate direction vector from angle
    const direction = new Vec2(
        Math.sin(angle),
        Math.cos(angle)
    );
    
    // Set initial velocity
    projectile.setLinearVelocity(direction.mul(-PROJECTILE.speed));
    
    return projectile;
};