"use client"
import { useRef, useEffect, Ref } from 'react';

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const blueCharacter = useRef({ x: 350, y: 300 });
    const redCharacter = useRef({ x: 600, y: 300 });
    const keysRef = useRef({
        ArrowUp: false,
        ArrowDown: false,
        w: false,
        s: false
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        //game variables
        canvas.width = 1000;
        canvas.height = 800;
        const character = { width: 50, height: 100 };
        const stage = { x: 250, y: 400, width: 500, height: 400 }
        let blueVelocityY = 0;
        let redVelocityY = 0;
        const gravity = 0.5;
        const jumpStrength = -10;
        let blueisJumping = false;
        let redisJumping = false;
        let animationFrameId: number;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keysRef.current && e.key === "s") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                blueVelocityY = jumpStrength;
                blueisJumping = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowDown") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                redVelocityY = jumpStrength;
                redisJumping = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof typeof keysRef.current] = false;

            }
        };

        const createChar = (color:string, pos:any)=>{
            ctx.fillStyle = color;
            ctx.fillRect(pos.x, pos.y, character.width, character.height);
        }

        const render = () => {
            const bluepos = blueCharacter.current;
            const redpos = redCharacter.current;
            const keys = keysRef.current;

            //Apply Gravity
            blueVelocityY += gravity;
            redVelocityY += gravity;
            bluepos.y += blueVelocityY;
            redpos.y += redVelocityY;


            // Enforce boundaries
            bluepos.y = Math.max(0, Math.min(bluepos.y, canvas.height - character.height));
            redpos.y = Math.max(0, Math.min(redpos.y, canvas.height - character.height));
            if(bluepos.y >= canvas.height -100){
                bluepos.y = canvas.height - 100;
                blueVelocityY = 0;
                blueisJumping = false
            }
            if(redpos.y >= canvas.height -100){
                redpos.y = canvas.height - 100;
                redVelocityY = 0;
                redisJumping = false
            }

            // Clear and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //stage draw
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(stage.x, stage.y, stage.width, stage.height)

            //charcter fill
            createChar("blue", bluepos);
            createChar("red", redpos)

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} />;
}

