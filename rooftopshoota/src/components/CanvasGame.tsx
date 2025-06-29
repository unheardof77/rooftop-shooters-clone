"use client"
import { useEffect, useRef } from 'react';
import { stepPhysics } from '../game/engine/physicsLoop';
import { createCharacter } from '../game/entities/Character';
import { createStage } from '../game/entities/Stage';
import { toCanvas, toCanvasDimensions } from '../game/utils/scale';
import {
    CHARACTER,
    METER,
    JUMP_IMPULSE,
    MAX_JUMP_DURATION,
    JUMP_SUSTAIN_FORCE,
    STABILIZATION_FORCE,
    HORIZONTAL_JUMP_FACTOR,
    JUMP_COOLDOWN
} from '../game/utils/constants';
import { clampJumpAngle } from '../game/utils/helpers';
import { createBackground, drawArm, drawCharacter, drawStage } from '../game/utils/drawutils'
import { returnCharacterSpawnPositions } from '../game/utils/helpers';
import { registerContacts } from '../game/engine/contactListeners';
import { Box, Fixture, Polygon, Vec2, Body } from 'planck';
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
        const { arm: blueArm, joint: blueJoint } = createArm(blueCharacter);
        const { arm: redArm, joint: redJoint } = createArm(redCharacter);
        //register contacts 
        const canBlueJump = registerContacts()
        const canRedJump = registerContacts()

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
        // Add to game state
        const jumpState = {
            blue: { isJumping: false, startTime: 0, lastJumpTime: 0 },
            red: { isJumping: false, startTime: 0, lastJumpTime: 0 }
        };


        const stabilizeCharacter = (character: Body) => {
            const angle = character.getAngle();
            const angularVelocity = character.getAngularVelocity();

            // Only apply stabilization when needed
            if (Math.abs(angle) > 0.1 || Math.abs(angularVelocity) > 0.1) {
                // Apply restoring torque to return to upright position
                const torque = -angle * STABILIZATION_FORCE - angularVelocity * 10;
                character.applyTorque(torque);
            }
        };

        const gameLoop = () => {
            stepPhysics();//allow physics 
            //create background
            createBackground(ctx);
            //check if jump conditions are met for characters.

            stabilizeCharacter(blueCharacter);
            stabilizeCharacter(redCharacter);

            // Handle blue character jumping
            if (canBlueJump() && keysRef.current.w) {
                const now = Date.now();
                if (now - jumpState.blue.lastJumpTime > JUMP_COOLDOWN && !jumpState.blue.isJumping) {
                    // Start jump
                    jumpState.blue.isJumping = true;
                    jumpState.blue.lastJumpTime = Date.now();

                    let angle = blueCharacter.getAngle();
                    angle = clampJumpAngle(angle);

                    // Calculate jump direction
                    const jumpDirection = new Vec2(
                        Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                        Math.cos(angle)
                    );

                    // Apply initial impulse
                    blueCharacter.applyLinearImpulse(
                        jumpDirection.mul(JUMP_IMPULSE),
                        blueCharacter.getWorldCenter()
                    );
                } else {
                    // Apply sustained force if still within jump duration
                    const elapsed = Date.now() - jumpState.blue.startTime;
                    if (elapsed < MAX_JUMP_DURATION) {
                        let angle = blueCharacter.getAngle();
                        angle = clampJumpAngle(angle);

                        const jumpDirection = new Vec2(
                            Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                            Math.cos(angle)
                        );

                        // Apply continuous force instead of impulse
                        blueCharacter.applyForceToCenter(
                            jumpDirection.mul(JUMP_SUSTAIN_FORCE)
                        );
                    }
                }
            } else {
                jumpState.blue.isJumping = false;
            }

            // Handle red character jumping
            if (canRedJump() && keysRef.current.i) {
                const now = Date.now();
                if (now - jumpState.red.lastJumpTime > JUMP_COOLDOWN && !jumpState.red.isJumping) {
                    // Start jump
                    jumpState.red.isJumping = true;
                    jumpState.red.lastJumpTime = Date.now();

                    let angle = redCharacter.getAngle();
                    angle = clampJumpAngle(angle);

                    // Calculate jump direction
                    const jumpDirection = new Vec2(
                        Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                        Math.cos(angle)
                    );

                    // Apply initial impulse
                    redCharacter.applyLinearImpulse(
                        jumpDirection.mul(JUMP_IMPULSE),
                        redCharacter.getWorldCenter()
                    );
                } else {
                    // Apply sustained force if still within jump duration
                    const elapsed = Date.now() - jumpState.red.startTime;
                    if (elapsed < MAX_JUMP_DURATION) {
                        let angle = redCharacter.getAngle();
                        angle = clampJumpAngle(angle);

                        const jumpDirection = new Vec2(
                            Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                            Math.cos(angle)
                        );

                        // Apply continuous force instead of impulse
                        redCharacter.applyForceToCenter(
                            jumpDirection.mul(JUMP_SUSTAIN_FORCE)
                        );
                    }
                }
            } else {
                jumpState.red.isJumping = false;
            }


            if (keysRef.current.e) {
                blueJoint?.setMotorSpeed(-2);
            } else {
                blueJoint?.setMotorSpeed(0);
            }
            if (keysRef.current.o) {
                redJoint?.setMotorSpeed(2);
            } else {
                redJoint?.setMotorSpeed(0);
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
            // Get positions and angles
            const blueCharPos = toCanvas(blueCharacter.getPosition());
            const blueCharAngle = blueCharacter.getAngle();
            const blueArmPos = toCanvas(blueArm.getPosition());
            const blueArmAngle = blueArm.getAngle();

            const redCharPos = toCanvas(redCharacter.getPosition());
            const redCharAngle = redCharacter.getAngle();
            const redArmPos = toCanvas(redArm.getPosition());
            const redArmAngle = redArm.getAngle();

            // Draw arms with character-relative transformations
            drawArm(ctx, blueCharPos, blueCharAngle, blueArmPos, blueArmAngle);
            drawArm(ctx, redCharPos, redCharAngle, redArmPos, redArmAngle);

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
