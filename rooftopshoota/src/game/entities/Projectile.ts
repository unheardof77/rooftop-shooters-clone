import {Vec2, Circle} from 'planck';
import { world } from '../engine/world';
import { PROJECTILE_SPEED } from '../utils/constants';

export const createProjectile = (x: number, y: number, angle: number) => {
    const bullet = world.createBody({
        type: 'dynamic',
        position: new Vec2(x, y),
        bullet: true,
    });
    bullet.createFixture(new Circle(0.2), { density: 1.0 });
    bullet.setLinearVelocity(new Vec2(
        Math.cos(angle) * PROJECTILE_SPEED,
        Math.sin(angle) * PROJECTILE_SPEED
    ));
    return bullet;
};