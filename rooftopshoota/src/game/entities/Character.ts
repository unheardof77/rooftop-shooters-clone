import { world } from '../engine/world';
import { Circle, Box, Vec2 } from 'planck';
import { CHARACTER } from '../utils/constants';

export const createCharacter = (x: number, y: number) => {
    const character = world.createBody({
        type: 'dynamic',
        position: { x, y },
        angularDamping: 0.8,
        fixedRotation: false
    });

    // Bottom circle (jump contact point)
    const bottomFixture = character.createFixture(new Circle(CHARACTER.radius), {
        density: 3,
        friction: 0.3,
        restitution: 0.2
    });
    bottomFixture.setUserData({ type: 'characterBottom' });

    // Upper body
    const bodyHeight = CHARACTER.height - CHARACTER.radius;
    const topFixture = character.createFixture(
        new Box(CHARACTER.width / 2, bodyHeight / 2,
            new Vec2(0, CHARACTER.radius + bodyHeight / 2)),
        { density: 0.5, friction: 0.2 }
    );
    topFixture.setUserData({ type: 'characterTop' });

    return character;
};
