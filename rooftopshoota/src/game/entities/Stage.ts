import {Box, Vec2} from 'planck';
import { world } from '../engine/world';
import { METER } from '../utils/constants';
import { returnStageDimensions } from '../utils/helpers';
import { CreateStage } from '../utils/types';
import { GROUND_CATEGORY, GROUND_MASK } from '../utils/collisionGroups';


export const createStage = ({canvasWidth, canvasHeight}:CreateStage) => {
    const {swP, shP} = returnStageDimensions(canvasWidth, canvasHeight);
    //box half dimensions in physics units
    const bhwP = swP / 2;
    const bhhP = shP / 2;
    //calculate desired stage position in pixels
    const desiredStageCenterX = canvasWidth / 2;

    //convert pixel position to pysics units
    const sxP = desiredStageCenterX / METER;
    const syP = bhhP;


    const stage = world.createBody({type:'static'});
    const fixture = stage.createFixture(new Box(bhwP, bhhP), {
        friction: 0.3, 
        density: 0,
        filterCategoryBits: GROUND_CATEGORY, // Ground category
        filterMaskBits: GROUND_MASK, // Collide with character/arm and projectiles
    });
    fixture.setUserData({ type: 'ground' });
    stage.setPosition(new Vec2(sxP,syP))
    return stage;
};
