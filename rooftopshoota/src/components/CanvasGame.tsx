"use client"
import { useEffect, useRef, useState } from 'react';
import { createCharacter } from '../game/entities/Character';
import { createStage } from '../game/entities/Stage';
import { returnCharacterSpawnPositions } from '../game/utils/helpers';
import { registerContacts } from '../game/engine/contactListeners';
import { createArm } from '../game/entities/Arm';
import { addCharacterJump } from '../game/entities/entityUtils/characterUtils';
import { addArmMotorControl } from '../game/entities/entityUtils/armUtils';
import { projectileSystem } from '../game/systems/projectileSystem';
import { respawnSystem } from '../game/systems/respawnSystem';
import { Keys, GameStatus } from '../game/utils/types';
import { renderScore, renderPaused, renderGameOver } from '../game/systems/renderUtils';
import { createHandleKeyDown, createHandleKeyUp, createHandleEscapeKey } from '../game/systems/inputUtils';
import { CANVAS } from '../game/utils/constants';
import { OptimizedRenderer } from '../game/systems/OptimizedRenderer';
import { RenderCuller } from '../game/systems/RenderCuller';
import { OptimizedDrawUtils } from '../game/systems/OptimizedDrawUtils';
import { toCanvas } from '../game/utils/scale';
import { OptimizedGameLoop } from '../game/systems/OptimizedGameLoop';
import { Body } from "planck";

const initialGameStatus: GameStatus = {
    gameStatus: "paused",
    score: {
        blue: 0,
        red: 0
    }
}

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<OptimizedRenderer | null>(null);
    const cullerRef = useRef<RenderCuller | null>(null);
    const keysRef = useRef<Keys>({ w: false, e: false, i: false, o: false, Escape: false});
    const prevKeysRef = useRef<Keys>({ w: false, e: false, i: false, o: false, Escape: false});
    const projectilesRef = useRef<Body[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);
    const gameStatusRef = useRef(gameStatus);
    
    const gameLoopRef = useRef<OptimizedGameLoop | null>(null);

    useEffect(() => {
        gameStatusRef.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        rendererRef.current = new OptimizedRenderer(canvas);
        cullerRef.current = new RenderCuller(CANVAS.width, CANVAS.height);
        
        gameLoopRef.current = new OptimizedGameLoop();
        
        const jumpState = {
            blue: { isJumping: false, startTime: 0, lastJumpTime: 0 },
            red: { isJumping: false, startTime: 0, lastJumpTime: 0 }
        };
        const spawn = returnCharacterSpawnPositions();

        canvas.width = CANVAS.width;
        canvas.height = CANVAS.height;

        const stage = createStage({ canvasWidth: canvas.width, canvasHeight: canvas.height });
        const blueCharacter = createCharacter(spawn.bx, spawn.by);
        const redCharacter = createCharacter(spawn.rx, spawn.ry);
        const { arm: blueArm, joint: blueJoint } = createArm(blueCharacter);
        const { arm: redArm, joint: redJoint } = createArm(redCharacter);

        const canBlueJump = registerContacts();
        const canRedJump = registerContacts();

        const handleKeyDown = createHandleKeyDown(keysRef);
        const handleKeyUp = createHandleKeyUp(keysRef);
        const handlePause = createHandleEscapeKey({setGameStatus});

        const gameLoop = (currentTime: number) => {
            const renderer = rendererRef.current!;
            const culler = cullerRef.current!;
            const optimizedGameLoop = gameLoopRef.current!;
            
            const { physicsInterpolator, spatialGrid } = optimizedGameLoop.update(currentTime, gameStatusRef.current);
            
            renderer.clearDirtyRegions();
            
            if (gameStatusRef.current.gameStatus === "playing") {
                addCharacterJump({ canBlueJump, blueCharacter, canRedJump, redCharacter, keysRef, jumpState });
                addArmMotorControl({ keysRef, blueJoint, redJoint });
                
                projectileSystem({ 
                    prevKeysRef, 
                    keysRef, 
                    blueArm, 
                    blueCharacter, 
                    redArm, 
                    redCharacter, 
                    projectilesRef, 
                    ctx,
                    spatialGrid
                });
                
                respawnSystem(blueCharacter, redCharacter, setGameStatus);
            }
            
            const drawUtils = new OptimizedDrawUtils(ctx);
            
            drawUtils.drawStageOptimized(stage, ctx);
            
            const blueInterpolated = physicsInterpolator.getInterpolatedState(blueCharacter);
            const redInterpolated = physicsInterpolator.getInterpolatedState(redCharacter);
            
            if (blueInterpolated) {
                const blueCharPos = toCanvas(blueInterpolated.position);
                if (culler.isVisible(blueCharPos.x - 50, blueCharPos.y - 100, 100, 200)) {
                    renderer.trackObject('blueCharacter', blueCharPos.x - 50, blueCharPos.y - 100, 100, 200);
                    drawUtils.drawCharacterOptimized(blueCharPos, blueInterpolated.angle, 'blue');
                }
            }
            
            if (redInterpolated) {
                const redCharPos = toCanvas(redInterpolated.position);
                if (culler.isVisible(redCharPos.x - 50, redCharPos.y - 100, 100, 200)) {
                    renderer.trackObject('redCharacter', redCharPos.x - 50, redCharPos.y - 100, 100, 200);
                    drawUtils.drawCharacterOptimized(redCharPos, redInterpolated.angle, 'red');
                }
            }
            
            const blueArmInterpolated = physicsInterpolator.getInterpolatedState(blueArm);
            const redArmInterpolated = physicsInterpolator.getInterpolatedState(redArm);
            
            drawUtils.drawArms([
                { 
                    pos: toCanvas(blueArmInterpolated?.position || blueArm.getPosition()), 
                    angle: blueArmInterpolated?.angle || blueArm.getAngle(), 
                    color: 'blue' 
                },
                { 
                    pos: toCanvas(redArmInterpolated?.position || redArm.getPosition()), 
                    angle: redArmInterpolated?.angle || redArm.getAngle(), 
                    color: 'red' 
                }
            ]);
            
            cullerRef.current?.renderProjectiles(projectilesRef.current, ctx, renderer);
            
            renderScore(ctx, gameStatusRef.current.score);
            if (gameStatusRef.current.gameStatus === "paused") {
                renderPaused(ctx);
            }
            renderGameOver(ctx, gameStatusRef.current);
            
            requestAnimationFrame(gameLoop);
        };
        
        gameLoop(0);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handlePause);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handlePause);
        }
    }, []);

    return <canvas ref={canvasRef} />;
}