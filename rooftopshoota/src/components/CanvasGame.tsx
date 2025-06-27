"use client"
import { useRef, useEffect } from 'react';

interface Projectile {
    x:number;
    y:number;
    vx:number;
    vy:number;
}

interface Character {
    x:number;
    y:number;
    vx:number;
    vy:number;
    jumping:boolean;
}

interface Arm {
    angle: number; // in radians
    charging: boolean;
    owner: 'blue' | 'red';
    x:number;
    y:number;
}

interface Keys {
    ArrowUp:boolean;
    ArrowDown:boolean;
    w:boolean;
    s:boolean;
}

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const blueCharacter = useRef<Character>({ x: 350, y: 300, vx:0, vy:0, jumping:false});
    const blueArm = useRef<Arm>({angle:Math.PI/2, charging:false, owner:"blue",x:350, y:350});
    const redCharacter = useRef<Character>({ x: 600, y: 300, vx:0, vy:0, jumping:false});
    const redArm = useRef<Arm>({angle:Math.PI/2, charging:false, owner:"red", x:600, y:350});
    const keysRef = useRef<Keys>({ArrowUp: false,ArrowDown: false,w: false,s: false});

    const projectilesRef = useRef<Projectile[]>([])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        //game variables
        canvas.width = 1000;
        canvas.height = 800;
        const character = { width: 50, height: 100 };
        const stage = { x: 250, y: 400, width: 500, height: 400 };
        const projectile = {height:6,width:6}
        const gravity = 0.5;
        const jumpStrength = -10;
        const armRotationSpeed = 0.02;
        const armLength = 50;

        let animationFrameId: number;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keysRef.current && e.key === "s") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                blueCharacter.current.vy = jumpStrength;
                blueCharacter.current.jumping = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowDown") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                redCharacter.current.vy = jumpStrength;
                redCharacter.current.jumping = true;
            }
            if (e.key in keysRef.current && e.key === "w") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                blueArm.current.charging = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowUp") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                redArm.current.charging = true;
            }


        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof typeof keysRef.current] = false;
            }
            if(e.key === 'w' ){
                blueArm.current.charging = false;
                const angle = blueArm.current.angle
                // const x = blueArm.current.x + armLength * Math.cos(angle);
                // const y = blueArm.current.y - armLength * Math.sin(angle);
                const x = blueArm.current.x
                const y = blueArm.current.y
                projectilesRef.current.push({x,y, vx:Math.cos(angle)*5,vy:Math.sin(angle)*5})
                blueArm.current.angle = Math.PI/2;
            }else if(e.key === 'ArrowUp'){
                redArm.current.charging = false;
                const angle = redArm.current.angle
                const x = redArm.current.x + armLength * Math.cos(angle);
                const y = redArm.current.y - armLength * Math.sin(angle);
                projectilesRef.current.push({x,y, vx:Math.cos(angle)*5,vy:Math.sin(angle)*5})
                redArm.current.angle = Math.PI/2;
            }
        };


        const addGravity = ()=>{
            const blue = blueCharacter.current;
            const red = redCharacter.current;
            blue.vy += gravity;
            red.vy += gravity;
            blue.y += blue.vy;
            red.y += red.vy;
        }


        const animateArms = ()=>{
            const blueA = blueArm.current;
            const redA = redArm.current;
            if(blueA.charging && blueA.angle >0){
                blueA.angle -= armRotationSpeed;
            }
            if(redA.charging && redA.angle >0){
                redA.angle -= armRotationSpeed;
            }
        }


        const boundaryChecker = () => {
            const blue = blueCharacter.current;
            const red = redCharacter.current;
            const helper = (char:Character)=>{
                char.y = Math.max(0, Math.min(char.y, canvas.height - character.height));
                if (char.y >= canvas.height - 100) {
                    char.y = canvas.height - 100;
                    char.vy = 0;
                    char.jumping = false
                }
                const onTopOfPlatform =
                    char.y + character.height <= stage.y + char.vy && // was above lastframe
                    char.y + character.height + char.vy >= stage.y && // is now hitting
                    char.x + character.width > stage.x &&
                    char.x < stage.x + stage.width;
                if (onTopOfPlatform) {
                    char.y = stage.y - character.height;
                    char.vy = 0;
                }
                
            }
            helper(blue)
            helper(red)
        }


        const handleProjectileMovement = ()=>{
            const arr = projectilesRef.current;
            const red = redCharacter.current;
            const blue = blueCharacter.current;

            const insideChar = (pro:Projectile)=>{
                if(pro.x >red.x&&pro.x <red.x+character.width){
                    if(pro.x > red.x && pro.x < red.x + character.width && pro.y > red.y && pro.y < red.y + character.height){
                        return true
                    }
                if(pro.x > blue.x && pro.x < blue.x + character.width && pro.y > blue.y && pro.y < blue.y + character.height){
                    if(pro.y> blue.y&& pro.y< blue.y+character.height){
                        return true
                    }
                }
                return false;
                }
            }

            for(let i=0; i< arr.length;i++){
                const pro = arr[i];
                //if statement controls when delete on x axis
                if(pro.x>= canvas.width || pro.x<=0 ){
                    arr.splice(i,1);
                    continue;
                }
                //if statement controls when delete on y axis
                if(pro.y <= 0 || pro.y >= canvas.height){
                    arr.splice(i,1);
                    continue;
                }
                //delete if inside a character
                if(insideChar(pro)){
                    arr.splice(i,1);
                    continue;
                }
                //moves the position of the pro
                pro.x +=pro.vx
                pro.y +=pro.vy
                arr[i] = pro;
            }
        }


        const renderGameBackground = () => {
            // Clear and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //stage draw
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(stage.x, stage.y, stage.width, stage.height)
        }


        const renderProjectile = ()=>{
            const arr = projectilesRef.current;
            for(let i=0;i<arr.length;i++){
                const pro = arr[i];
                ctx.fillStyle = 'black';
                ctx.fillRect(pro.x,pro.y,projectile.width, projectile.height)
            }
        }


        const renderChars = () => {
            const blue = blueCharacter.current;
            const red = redCharacter.current;
            const helper = (color:string, char:Character)=>{
                ctx.fillStyle = color;
                ctx.fillRect(char.x, char.y, character.width, character.height);
            }
            helper("blue", blue);
            helper("red", red)
        }


        const renderArms = ()=>{
            const blueA = blueArm.current;
            const redA = redArm.current;
            const isblue = true;
            const helper = (arm:Arm, isblue=false)=>{
                const angle = arm.angle;

                const armOrigin = isblue ? {x:arm.x +character.width, y: arm.y+(character.height/2)}:{x:arm.x,y:arm.y+(character.height/2)}
                const x = armOrigin.x + armLength * Math.cos(angle);
                const y = armOrigin.y - armLength * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(armOrigin.x, armOrigin.y);
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 5;
                ctx.stroke();
            }
            helper(blueA, isblue)
            helper(redA)
        }

        const gameLoop = () => {

            //Apply Gravity
            addGravity();

            //start animation of arms rotation
            animateArms();
            // Enforce boundaries of map, stage, and projectile.
            boundaryChecker();
            handleProjectileMovement();

            //render all the stuff lol
            renderGameBackground();
            renderProjectile();
            renderChars();
            renderArms();
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

