import {Box, Circle} from 'planck';
import { world } from '../engine/world';
import { CHARACTER, METER } from '../utils/constants';

export const createCharacter = (x: number, y: number) => {
    const character = world.createBody({
        type: 'dynamic',
        position: {x,y},
        angularDamping: 0.2,
    });
    const chhP = CHARACTER.height/2/METER;
    const chwP = CHARACTER.width/2/METER;
    character.createFixture(new Box(chwP, chhP), { density: 10, friction: 0.3 });
    character.createFixture(new Circle(0.5), {density:10, isSensor:true});
    return character;
};
