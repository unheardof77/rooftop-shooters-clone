import {Vec2} from 'planck';
import {METER, CANVAS} from './constants'
// Planck.js (0,0) is bottom-left. Canvas (0,0) is top-left.
// Converts Planck coordinates to Canvas coordinates
export const toCanvas = (vec: Vec2) => ({
        x: vec.x * METER,
        y: CANVAS.height - (vec.y * METER)
    });// Converts Canvas coordinates to Planck Coordinates
export const toPhysics = (x:number, y:number) => {
    return new Vec2(x / METER, (CANVAS.height - y) / METER);
}// Converts Canvas dimensions to Planck dimensions
export const toWorld = (x: number, y: number) =>{ 
    return new Vec2(x / METER, y / METER)
};// Converts half of a canvas dimension to full canvas dimensions
export const toCanvasDimensions = (half:number) => {
    return half * 2 * METER;
}
