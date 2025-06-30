"use client"
import { useEffect, useRef } from 'react';
import { stepPhysics } from '../game/engine/physicsLoop';
import { createCharacter } from '../game/entities/Character';
import { createStage } from '../game/entities/Stage';
import { createBackground } from '../game/utils/drawutils';
import { returnCharacterSpawnPositions } from '../game/utils/helpers';
import { registerContacts } from '../game/engine/contactListeners';
import { Body } from 'planck';
import { createArm } from '../game/entities/Arm';

import { stabilizeCharacter } from '../game/engine/physicsUtils';
import { addCharacterJump } from '../game/entities/entityUtils/characterUtils';
import { addArmMotorControl } from '../game/entities/entityUtils/armUtils';
import { projectileSystem } from '../game/systems/projectileSystem';
import { renderStage } from '../game/systems/renderUtils';

import { Keys } from '../game/utils/types';
import { renderCharacters, renderArms } from '../game/systems/renderUtils';
import { createHandleKeyDown, createHandleKeyUp } from '../game/systems/inputUtils';
import { CANVAS } from '../game/utils/constants';


export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keysRef = useRef<Keys>({ w: false, e: false, i: false, o: false });
    const prevKeysRef = useRef<Keys>({ w: false, e: false, i: false, o: false });
    const projectilesRef = useRef<Body[]>([]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const jumpState = {
            blue: { isJumping: false, startTime: 0, lastJumpTime: 0 },
            red: { isJumping: false, startTime: 0, lastJumpTime: 0 }
        };
        const spawn = returnCharacterSpawnPositions();

        canvas.width = CANVAS.width;
        canvas.height = CANVAS.height;

        //CREATE STAGE
        const stage = createStage({ canvasWidth: canvas.width, canvasHeight: canvas.height });
        //CREATE CHARACTERS
        const blueCharacter = createCharacter(spawn.bx, spawn.by);
        const redCharacter = createCharacter(spawn.rx, spawn.ry);
        //ATTACH ARMS
        const { arm: blueArm, joint: blueJoint } = createArm(blueCharacter);
        const { arm: redArm, joint: redJoint } = createArm(redCharacter);

        //REGISTER COLLISION
        const canBlueJump = registerContacts()
        const canRedJump = registerContacts()

        //REGISTER EVENT LISTENERS
        const handleKeyDown = createHandleKeyDown(keysRef);
        const handleKeyUp = createHandleKeyUp(keysRef);

        const gameLoop = () => {
            //PHYSICS
            stepPhysics();
            stabilizeCharacter(blueCharacter);
            stabilizeCharacter(redCharacter);

            //RESET BACKGROUND (RENDER = REDRAW)
            createBackground(ctx, "lightyellow")

            //INPUT LISTENERS
            addCharacterJump({ canBlueJump, blueCharacter, canRedJump, redCharacter, keysRef, jumpState })
            addArmMotorControl({ keysRef, blueJoint, redJoint })

            //PROJECTILE RENDER/DELETION
            projectileSystem({ prevKeysRef, keysRef, blueArm, blueCharacter, redArm, redCharacter, projectilesRef, ctx })

            //RENDERING
            renderStage(stage, ctx);
            renderCharacters(ctx, { blueCharacter, redCharacter })
            renderArms(ctx, { blueArm, redArm, blueCharacter, redCharacter })
            

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
