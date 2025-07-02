import { toCanvas, toCanvasDimensions } from '../utils/scale';
import { drawStage } from '../utils/drawutils';
import { Box, Body } from 'planck';
import { drawCharacter, drawArm, drawScore, drawPaused, drawGameOver } from '../utils/drawutils';
import { RenderArms, RenderCharacters, GameStatus } from '../utils/types';


export function renderStage(stage: Body, ctx: CanvasRenderingContext2D) {
    //RENDER STAGE
    const scC = toCanvas(stage.getPosition());//returns stage body center position
    const fix = stage.getFixtureList();//stage only has one fixture
    let shape;
    if (fix) {//make sure the fixture exist
        shape = fix.getShape();
    }
    if (shape?.getType() === 'polygon') {//box are polygon's
        const boxShape = shape as Box;//Cast shape to box to access propertys
        //get half dimensions using verticies, the absolute value is 1/2 of w/h
        const hwP: number = Math.abs(boxShape.m_vertices[0].x);
        const hhP: number = Math.abs(boxShape.m_vertices[0].y);
        //convert half dimensions to canvas dimensions
        const cwC = toCanvasDimensions(hwP);
        const chC = toCanvasDimensions(hhP)

        //DRAW STAGE USING CANVAS POSITIONS
        drawStage(ctx, { scC, cwC, chC })
    }
}

export function renderScore(ctx: CanvasRenderingContext2D, score: { blue: number, red: number }) {
    drawScore(ctx, score);
}

export function renderPaused(ctx: CanvasRenderingContext2D) {
    drawPaused(ctx);
}

export function renderGameOver(ctx: CanvasRenderingContext2D, gameStatus:GameStatus) {
    if(gameStatus.gameStatus === "gameOver"){
        const winner = gameStatus.score.blue > gameStatus.score.red ? "blue" : "red";
        drawGameOver(ctx, winner);
    }
}

export function renderCharacters(ctx: CanvasRenderingContext2D, { blueCharacter, redCharacter }: RenderCharacters) {
    const blueCharPos = toCanvas(blueCharacter.getPosition());
    const redCharPos = toCanvas(redCharacter.getPosition());
    const blueCharAngle = blueCharacter.getAngle();
    const redCharAngle = redCharacter.getAngle();

    drawCharacter(ctx, blueCharPos, blueCharAngle, "blue");
    drawCharacter(ctx, redCharPos, redCharAngle, "red");
}
export function renderArms(ctx: CanvasRenderingContext2D, { blueArm, redArm, blueCharacter, redCharacter }: RenderArms) {
    // Get positions and angles
    const blueCharPos = toCanvas(blueCharacter.getPosition());
    const redCharPos = toCanvas(redCharacter.getPosition());
    const blueCharAngle = blueCharacter.getAngle();
    const redCharAngle = redCharacter.getAngle();

    drawArm(ctx,blueCharPos, blueCharAngle, blueArm.getAngle());
    drawArm(ctx,redCharPos, redCharAngle, redArm.getAngle());
}