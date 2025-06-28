"use client"
import { useRef, useEffect } from 'react';
import Arm from '../game/Classes/Arm';
import Character from '../game/Classes/Character';
import Projectile from '../game/Classes/Projectile';
import {stage, gravity, jumpStrength, canvas, muzzleOffset} from '../game/variables'


interface Keys {
    ArrowUp: boolean;
    ArrowDown: boolean;
    w: boolean;
    s: boolean;
}

export default function CanvasGame() {
    const keysRef = useRef<Keys>({ ArrowUp: false, ArrowDown: false, w: false, s: false });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const projectilesRef = useRef<Projectile[]>([])

    const BlueCharacter = new Character({ 
        x: 350,
        y: 300,
        vx: 0,
        vy: 0,
        jumping: false,
        color: "blue"
    });
    const RedCharacter = new Character({ x: 600,
        y: 300,
        vx: 0,
        vy: 0,
        jumping: false,
        color: "red"
    });
    const BlueArm = new Arm({ 
        angle: Math.PI / 2,
        charging: false,
        owner: "blue",
        x: 400, y: 350
    });
    const RedArm = new Arm({ 
        angle: Math.PI / 2,
        charging: false,
        owner: "red",
        x: 600, y: 350 
    });


    useEffect(() => {
        const canvs = canvasRef.current;
        const ctx = canvs?.getContext('2d');
        if (!canvs || !ctx) return;
        let animationFrameId: number;
        canvs.width = canvas.width;
        canvs.height = canvas.height;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keysRef.current && e.key === "s") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                BlueCharacter.vy = jumpStrength;
                BlueCharacter.jumping = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowDown") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                RedCharacter.vy = jumpStrength;
                RedCharacter.jumping = true;
            }
            if (e.key in keysRef.current && e.key === "w") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                BlueArm.setCharging = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowUp") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                RedArm.setCharging = true;
            }


        };

        const handleKeyUp = (e: KeyboardEvent) => {
            // enough to move the spawn out of collision
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof typeof keysRef.current] = false;
            }
            if (e.key === 'w') {
                BlueArm.setCharging = false;
                const angle = BlueArm.getAngle;
                const pos = BlueArm.position;
                const x = pos.x + (Arm.armLength + muzzleOffset) * Math.cos(angle);
                const y = pos.y + (Arm.armLength + muzzleOffset) * Math.sin(angle);
                const Pro = new Projectile({ x, y, vx: Math.cos(angle) * 5, vy: -Math.sin(angle) * 5 });
                projectilesRef.current.push(Pro)
                BlueArm.setAngle = Math.PI / 2;
            } else if (e.key === 'ArrowUp') {
                RedArm.setCharging = false;
                const angle = RedArm.getAngle;
                const pos = RedArm.position;
                const x = pos.x + (Arm.armLength + muzzleOffset) * Math.cos(angle);
                const y = pos.y + (Arm.armLength + muzzleOffset) * Math.sin(angle);
                const Pro = new Projectile({ x, y, vx: Math.cos(angle) * 5, vy: -Math.sin(angle) * 5 })
                projectilesRef.current.push(Pro)
                RedArm.setAngle = Math.PI / 2;
            }
        };


        const renderGameBackground = () => {
            // Clear and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //stage draw
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(stage.x, stage.y, stage.width, stage.height)
        }

        const gameLoop = () => {

            //Apply Gravity
            RedCharacter.addGravity(gravity);
            BlueCharacter.addGravity(gravity);
            //Attach the arms to character
            RedCharacter.attachArm({arm:RedArm});
            BlueCharacter.attachArm({arm:BlueArm});
            //start animation of arms rotation
            RedArm.animateArm();
            BlueArm.animateArm();
            // Enforce boundaries of map, stage, and projectile.
            RedCharacter.boundaryChecker({ canvas:canvs, stage });
            BlueCharacter.boundaryChecker({ canvas:canvs, stage });

            for (let i = 0; i < projectilesRef.current.length; i++) {
                //take care of projectile out of bounds/in character
                projectilesRef.current[i].handleProjectileMovement({
                    red: RedCharacter,
                    blue: BlueCharacter,
                    refarr: projectilesRef.current,
                    canvas: canvs,
                    i: i
                });
            }

            //render all the stuff lol
            renderGameBackground();
            RedCharacter.renderCharacter(ctx);
            BlueCharacter.renderCharacter(ctx);
            RedArm.renderArm(ctx);
            BlueArm.renderArm(ctx);
            for (let i = 0; i < projectilesRef.current.length; i++) {
                //renders all projectiles on screen.
                projectilesRef.current[i].renderProjectile(ctx);
            }
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        animationFrameId = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} />;
}

