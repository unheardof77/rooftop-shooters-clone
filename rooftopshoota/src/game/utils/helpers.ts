import { Body } from 'planck';
import { METER, CANVAS, CHARACTER,MAX_JUMP_ANGLE, MAX_JUMP_DURATION } from './constants';

export const returnStageDimensions = (canvasWidth: number, canvasHeight: number) => {
    //desired stage diemensions in pixels
    const desiredStageWidthPixels = canvasWidth / 2;
    const desiredStageHeightPixels = canvasHeight / 2;
    //convert pixels to meters
    const swP = desiredStageWidthPixels / METER;
    const shP = desiredStageHeightPixels / METER;
    //Center of stage in physics units
    const scxP = (canvasWidth / 2) / METER;
    return { swP, shP, scxP };
}

export const returnCharacterSpawnPositions = () => {
    //Get stage information
    const { swP, shP, scxP } = returnStageDimensions(CANVAS.width, CANVAS.height);
    const characterHalfHeightP = (CHARACTER.height / 2) / METER;
    const stageLeftEdgeP = scxP - (swP / 2);
    const stageRightEdgeP = scxP + (swP / 2);
    //calculate characters x and y spawns
    const blueCharacterSpawnX = stageLeftEdgeP + 3;
    const BlueCharacterSpawnY = shP + characterHalfHeightP + 0.01;
    const redCharacterSpawnX = stageRightEdgeP - 3;
    const redCharacterSpawnY = shP + characterHalfHeightP + 0.01;

    return { bx:blueCharacterSpawnX, by:BlueCharacterSpawnY, rx:redCharacterSpawnX, ry:redCharacterSpawnY };
}

export const clampJumpAngle = (angle: number) => {
    // Normalize angle to -π to π range
    let normalized = angle % (Math.PI * 2);
    if (normalized > Math.PI) normalized -= Math.PI * 2;
    if (normalized < -Math.PI) normalized += Math.PI * 2;
    
    // Clamp to maximum jump angle
    return Math.max(
        -MAX_JUMP_ANGLE, 
        Math.min(MAX_JUMP_ANGLE, normalized)
    );
};
