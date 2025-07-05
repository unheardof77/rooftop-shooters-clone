"use client"
import { useEffect, useRef, useState } from 'react';
import { createCharacter } from '../game/entities/Character';
import { createStage } from '../game/entities/Stage';
import { returnCharacterSpawnPositions } from '../game/utils/helpers';
import { registerContacts } from '../game/engine/contactListeners';
import { createArm } from '../game/entities/Arm';
import { respawnSystem } from '../game/systems/respawnSystem';
import { Keys, GameStatus, GameStatusType, Color } from '../game/utils/types';
import { CANVAS, METER, CHARACTER, ARM } from '../game/utils/constants';
import { OptimizedRenderer } from '../game/systems/OptimizedRenderer';
import { RenderCuller } from '../game/systems/RenderCuller';
import { OptimizedDrawUtils } from '../game/systems/OptimizedDrawUtils';
import { toCanvas } from '../game/utils/scale';
import { GameEngine } from '../game/engine/GameEngine';
import { Body } from "planck";

const initialGameStatus: GameStatus = {
    gameStatus: GameStatusType.PAUSED,
    score: {
        blue: 0,
        red: 0
    }
}

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<OptimizedRenderer | null>(null);
    const cullerRef = useRef<RenderCuller | null>(null);
    const keysRef = useRef<Keys>({ w: false, e: false, i: false, o: false, Escape: false });
    const prevKeysRef = useRef<Keys>({ w: false, e: false, i: false, o: false, Escape: false });
    const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);
    const gameStatusRef = useRef(gameStatus);

    const gameEngineRef = useRef<GameEngine | null>(null);

    useEffect(() => {
        gameStatusRef.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        rendererRef.current = new OptimizedRenderer(canvas);
        cullerRef.current = new RenderCuller(CANVAS.width, CANVAS.height);

        gameEngineRef.current = new GameEngine();

        const jumpState = {
            blue: { isJumping: false, startTime: 0, lastJumpTime: 0 },
            red: { isJumping: false, startTime: 0, lastJumpTime: 0 }
        };
        const spawn = returnCharacterSpawnPositions();

        canvas.width = CANVAS.width;
        canvas.height = CANVAS.height;

        const stage = createStage({ canvasWidth: canvas.width, canvasHeight: canvas.height });
        const blueCharacter = createCharacter(spawn.bx, spawn.by, Color.BLUE);
        const redCharacter = createCharacter(spawn.rx, spawn.ry, Color.RED);
        const { arm: blueArm, joint: blueJoint } = createArm(blueCharacter);
        const { arm: redArm, joint: redJoint } = createArm(redCharacter);

        const [canBlueJump, canRedJump] = registerContacts();
        const { handleKeyDown, handleKeyUp, handleEscapeKey } = gameEngineRef.current!.mountInputSystem({ keysRef, prevKeysRef, setGameStatus, blueJoint, redJoint });

        const gameLoop = (currentTime: number) => {
            const renderer = rendererRef.current!;
            const culler = cullerRef.current!;
            const gameEngine = gameEngineRef.current!;

            const { physicsInterpolator, frameController } = gameEngine.update(currentTime, gameStatusRef.current);

            // Check if we should render this frame based on target FPS
            if (!frameController.shouldRender(currentTime)) {
                requestAnimationFrame(gameLoop);
                return;
            }

            renderer.clearDirtyRegions();

            if (gameStatusRef.current.gameStatus === "playing") {
                gameEngine.mountEventListeners(canBlueJump, canRedJump, blueCharacter, redCharacter, blueArm, redArm);
                respawnSystem(blueCharacter, redCharacter, setGameStatus);
            }

            const drawUtils = new OptimizedDrawUtils(ctx);

            drawUtils.drawStageOptimized(stage, ctx);

            const blueInterpolated = physicsInterpolator.getInterpolatedState(blueCharacter);
            const redInterpolated = physicsInterpolator.getInterpolatedState(redCharacter);
            const blueArmInterpolated = physicsInterpolator.getInterpolatedState(blueArm);
            const redArmInterpolated = physicsInterpolator.getInterpolatedState(redArm);

            if (blueInterpolated) {
                const blueCharPos = toCanvas(blueInterpolated.position);
                if (culler.isVisible(blueCharPos.x, blueCharPos.y, CHARACTER.width * METER, CHARACTER.height * METER)) {
                    renderer.trackObject('body_character_blue', blueCharPos, blueInterpolated.angle);
                    renderer.trackObject('lowerBody_character_blue', blueCharPos, blueInterpolated.angle);
                    drawUtils.drawCharacterOptimized(blueCharPos, blueInterpolated.angle, 'blue');
                }
            }

            if (redInterpolated) {
                const redCharPos = toCanvas(redInterpolated.position);
                if (culler.isVisible(redCharPos.x, redCharPos.y, CHARACTER.width * METER, CHARACTER.height * METER)) {
                    renderer.trackObject('body_character_red', redCharPos, redInterpolated.angle);
                    renderer.trackObject('lowerBody_character_red', redCharPos, redInterpolated.angle);
                    drawUtils.drawCharacterOptimized(redCharPos, redInterpolated.angle, 'red');
                }
            }
            // Draw arms with proper null checking
            const armsToDraw = [];
            if (blueArmInterpolated) {
                const blueArmPos = toCanvas(blueArmInterpolated.position);
                if (culler.isVisible(blueArmPos.x, blueArmPos.y, ARM.width * METER, ARM.height * METER)) {
                    renderer.trackObject('arm_blue', blueArmPos, blueArmInterpolated.angle);
                    armsToDraw.push({pos: toCanvas(blueArmInterpolated.position), angle: blueArmInterpolated.angle,color: 'blue'});
                }
            }
            if (redArmInterpolated) {
                const redArmPos = toCanvas(redArmInterpolated.position);
                if (culler.isVisible(redArmPos.x, redArmPos.y, ARM.width * METER, ARM.height * METER)) {
                    renderer.trackObject('arm_red', redArmPos, redArmInterpolated.angle);
                    armsToDraw.push({pos: toCanvas(redArmInterpolated.position),angle: redArmInterpolated.angle,color: 'red'});
                }
            }
            
            if (armsToDraw.length > 0) {
                drawUtils.drawArms(armsToDraw);
            }

            // RENDER PRJECTILES/UPDATE PROJECTILE TRACKING
            const projectileSystem = gameEngine.getProjectileSystem();
            projectileSystem.updateAndTrackAndDraw(renderer, culler, drawUtils);

            drawUtils.drawScore(gameStatusRef.current.score);
            drawUtils.drawFPS(frameController.getFPS(), frameController.getTargetFPS());
            if (gameStatusRef.current.gameStatus === "paused") {
                drawUtils.drawPaused();
            }
            if (gameStatusRef.current.gameStatus === "gameOver") {
                const winner = gameStatusRef.current.score.blue > gameStatusRef.current.score.red ? "blue" : "red";
                drawUtils.drawGameOver(winner);
            }

            // Update previous key states for next frame
            prevKeysRef.current = { ...keysRef.current };

            requestAnimationFrame(gameLoop);
        };

        gameLoop(0);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleEscapeKey);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleEscapeKey);

            // Cleanup physics interpolator to prevent memory leaks
            if (gameEngineRef.current) {
                const { physicsInterpolator } = gameEngineRef.current.update(0, gameStatusRef.current);
                if (physicsInterpolator && typeof physicsInterpolator.cleanup === 'function') {
                    physicsInterpolator.cleanup();
                }
            }
        }
    }, []);

    return <canvas ref={canvasRef} />;
}