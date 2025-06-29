import {World} from 'planck';
import { GRAVITY } from '../utils/constants';

export const world = new World({
    gravity: {x:0, y: GRAVITY},
    allowSleep:true
})