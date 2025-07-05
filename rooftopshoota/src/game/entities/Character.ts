import { world } from '../engine/world';
import { Circle, Box, Vec2, Fixture } from 'planck';
import { CHARACTER } from '../utils/constants';
import { GROUND_CATEGORY, CHARACTER_MASK } from '../utils/collisionGroups';
import { Color } from '../utils/types';

export const createCharacter = (x: number, y: number, color: Color) => {
    const character = world.createBody({
        type: 'dynamic',
        position: { x, y },
        angularDamping: CHARACTER.dampening,
        fixedRotation: false
    });

    // Bottom circle (jump contact point)
    const bottomFixture = character.createFixture(new Circle(CHARACTER.radius), {
        density: CHARACTER.bottom.density,
        friction: CHARACTER.bottom.friction,
        restitution: CHARACTER.bottom.restitution,
        filterCategoryBits: GROUND_CATEGORY, // Character category
        filterMaskBits: CHARACTER_MASK, // Collide with ground and projectiles
    });
    bottomFixture.setUserData({ type: 'character', subtype: 'bottom', color });

    // Upper body
    const bodyHeight = CHARACTER.height - CHARACTER.radius;
    const topFixture = character.createFixture(
        new Box(CHARACTER.width / 2, bodyHeight / 2,
            new Vec2(0, CHARACTER.radius + bodyHeight / 2)),
        { 
            density: CHARACTER.top.density, 
            friction: CHARACTER.top.friction,
            filterCategoryBits: GROUND_CATEGORY, // Character category
            filterMaskBits: CHARACTER_MASK, // Collide with ground and projectiles
        }
    );
    topFixture.setUserData({ type: 'character', subtype: 'top', color });

    return character;
};
