import { CANVAS } from './constants';
interface PosCords {
    x: number; // x position in canvas pixels
    y: number; // y position in canvas pixels
}
interface DrawStage {
    scC: {
        x: number; // stage center x position in canvas pixels
        y: number; // stage center y position in canvas pixels
    }
    cwC: number; // canvas width in pixels
    chC: number; // canvas height in pixels
}
export const createBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);//clear canvas
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);//fill canvas
}
//takes in canvas context and Canvas dimesions
export const drawStage = (ctx: CanvasRenderingContext2D, { scC, cwC, chC }: DrawStage) => {
    ctx.save();
    ctx.translate(scC.x, scC.y);//move origin to center of stage
    ctx.fillStyle = 'grey';
    ctx.fillRect(-cwC / 2, -chC / 2, cwC, chC)
    ctx.restore();
}
//draws a character at a given position and angle
export const drawCharacter = (ctx: CanvasRenderingContext2D, pos: PosCords, angle: number, color:string) => {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.fillRect(-25, -50, 50, 100);
    ctx.restore();
}