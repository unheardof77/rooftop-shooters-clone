import { CANVAS, ARM_LENGTH, METER, CHARACTER } from './constants';
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
export const drawCharacter = (ctx: CanvasRenderingContext2D, pos: PosCords, angle: number, color: string) => {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    // Draw circular base
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, CHARACTER.radius * METER, 0, Math.PI * 2);
    ctx.fill();

    // Draw rectangular body - now oriented based on physics rotation
    const bodyHeight = (CHARACTER.height - CHARACTER.radius) * METER;
    ctx.fillRect(
        -CHARACTER.width / 2 * METER,
        -CHARACTER.radius * METER,
        CHARACTER.width * METER,
        -bodyHeight
    );

    // Add visual indicator for "top" of character
    ctx.fillStyle = 'yellow';
    ctx.fillRect(
        -5,
        -CHARACTER.height * METER + 10,
        10,
        10
    );

    ctx.restore();
};
export const drawArm = (ctx: CanvasRenderingContext2D, characterPos: PosCords, characterAngle: number, armPos: PosCords, armAngle: number) => {
    ctx.save();

    // First apply character transformation
    ctx.translate(characterPos.x, characterPos.y);
    ctx.rotate(characterAngle);

    // Then apply arm position relative to character
    const relativeX = armPos.x - characterPos.x;
    const relativeY = armPos.y - characterPos.y;
    ctx.translate(relativeX, relativeY);

    // Apply arm rotation relative to character
    ctx.rotate(armAngle);

    // Draw arm extending downward from pivot point
    ctx.fillStyle = 'black';
    ctx.fillRect(
        -0.1 * METER,  // x offset (left)
        0,             // y offset (top of arm)
        0.2 * METER,   // width
        ARM_LENGTH * METER // height (full length downward)
    );

    ctx.restore();
};