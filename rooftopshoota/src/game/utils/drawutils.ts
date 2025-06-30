import { CANVAS, ARM_LENGTH, METER, CHARACTER, PROJECTILE_RADIUS } from './constants';
import { PosCords, DrawStage } from './types';
export const createBackground = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);//clear canvas
    ctx.fillStyle = color;
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
export const drawArm = (
    ctx: CanvasRenderingContext2D,
    characterPos: PosCords,
    characterAngle: number,
    armAngle: number
) => {
    ctx.save();

    // Start at character position
    ctx.translate(characterPos.x, characterPos.y);
    ctx.rotate(characterAngle);

    // Move to character's top (attachment point)
    const topOffsetY = -CHARACTER.height * METER;
    ctx.translate(0, topOffsetY);

    // Apply arm rotation
    ctx.rotate(armAngle);

    // Draw arm extending downward
    ctx.fillStyle = 'black';
    ctx.fillRect(
        -0.1 * METER,
        0,
        0.2 * METER,
        ARM_LENGTH * METER
    );

    ctx.restore();
};
export const drawProjectile = (ctx: CanvasRenderingContext2D, pos: PosCords) => {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, PROJECTILE_RADIUS * METER, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};