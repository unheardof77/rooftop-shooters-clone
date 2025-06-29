"use client"
import { useEffect, useRef } from 'react';
import { stepPhysics } from '../game/engine/physicsLoop';
import { createCharacter } from '../game/entities/Character';
import { createStage } from '../game/entities/Stage';
import { toCanvas, toCanvasDimensions } from '../game/utils/scale';
import { CHARACTER, METER, JUMP_IMPULSE } from '../game/utils/constants';
import { createBackground, drawArm, drawCharacter, drawStage } from '../game/utils/drawutils'
import { returnCharacterSpawnPositions } from '../game/utils/helpers';
import { registerContacts } from '../game/engine/contactListeners';
import { Box, Fixture, Polygon, Vec2 } from 'planck';
import createArm from '../game/entities/Arm';

interface Keys {
    w: boolean;
    e: boolean;
    i: boolean;
    o: boolean;
}

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keysRef = useRef<Keys>({ w: false, e: false, i: false, o: false })
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1000;
        canvas.height = 800;
        //create the stage
        const stage = createStage({ canvasWidth: canvas.width, canvasHeight: canvas.height });

        const {
            blueCharacterSpawnX,
            BlueCharacterSpawnY,
            redCharacterSpawnX,
            redCharacterSpawnY
        } = returnCharacterSpawnPositions();
        //create characters
        const blueCharacter = createCharacter(blueCharacterSpawnX, BlueCharacterSpawnY);
        const redCharacter = createCharacter(redCharacterSpawnX, redCharacterSpawnY);
        //attach arms
        const {arm:blueArm, joint:blueJoint} = createArm(blueCharacter);
        const {arm:redArm, joint:redJoint} = createArm(redCharacter);
        //register contacts 
        const canBlueJump = registerContacts(blueCharacter, stage)
        const canRedJump = registerContacts(redCharacter, stage)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof Keys] = true;
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof Keys] = false;
            }
        }

        const gameLoop = () => {
            stepPhysics();//allow physics 
            //create background
            createBackground(ctx);
            //check if jump conditions are met for characters.
            if (canBlueJump() && keysRef.current.w) {
                blueCharacter.applyLinearImpulse(JUMP_IMPULSE,blueCharacter.getWorldPoint(new Vec2(0,0)))
            }
            if (canRedJump() && keysRef.current.i) {
                redCharacter.applyLinearImpulse(JUMP_IMPULSE,redCharacter.getWorldPoint(new Vec2(0,0)))
            }

            if(keysRef.current.e){
                blueJoint?.setMotorSpeed(-2);
            }else {
                blueJoint?.setMotorSpeed(0);
            }


            //render stage 
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


            //RENDER CHARACTERS
            const pos = toCanvas(blueCharacter.getPosition());
            const redpos = toCanvas(redCharacter.getPosition());
            const angle = blueCharacter.getAngle();
            const redangle = redCharacter.getAngle();
            drawCharacter(ctx, pos, angle, "blue");
            drawCharacter(ctx, redpos, redangle, "red");

            //RENDER ARMS 
            const bluePos = toCanvas(blueArm.getPosition());
            const redPos = toCanvas(redArm.getPosition());
            const blueAngle = blueArm.getAngle();
            const redAngle = redArm.getAngle();
            drawArm(ctx, bluePos, blueAngle)
            drawArm(ctx, redPos, redAngle)

            //continue to next frame
            requestAnimationFrame(gameLoop);
        };

        gameLoop();

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, []);

    return <canvas ref={canvasRef} />;
}
