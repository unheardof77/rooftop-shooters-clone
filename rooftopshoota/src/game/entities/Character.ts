import {Box, Circle} from 'planck';
import { world } from '../engine/world';

export const createCharacter = (x: number, y: number) => {
    const character = world.createBody({
        type: 'dynamic',
        position: {x,y},
        angularDamping: 0.2,
    });
    character.createFixture(new Box(0.5, 1), { density: 1, friction: 0.3 });
    character.createFixture(new Circle(0.5), {density:10, isSensor:true});
    return character;
};
