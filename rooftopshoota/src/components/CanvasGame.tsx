"use client"
import { useRef, useEffect, Ref } from 'react';

interface ProjectileRef {
    height:number;
    width:number;
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
}

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const blueCharacter = useRef<Character>({ x: 350, y: 300, vx:0, vy:0});
    const redCharacter = useRef<Character>({ x: 600, y: 300, vx:0, vy:0});
    const keysRef = useRef({ArrowUp: false,ArrowDown: false,w: false,s: false});

    const projectilesRef = useRef<ProjectileRef[]>([])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        //game variables
        canvas.width = 1000;
        canvas.height = 800;
        const character = { width: 50, height: 100 };
        const stage = { x: 250, y: 400, width: 500, height: 400 }

        const gravity = 0.5;
        const jumpStrength = -10;
        let blueisJumping = false;
        let redisJumping = false;
        let animationFrameId: number;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keysRef.current && e.key === "s") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                blueCharacter.current.vy = jumpStrength;
                blueisJumping = true;
            }
            if (e.key in keysRef.current && e.key === "ArrowDown") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                redCharacter.current.vy = jumpStrength;
                redisJumping = true;
            }
            if (e.key in keysRef.current && e.key === "w") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;
                projectilesRef.current.push({
                    x:blueCharacter.current.x +character.width/2,
                    y:blueCharacter.current.y + character.height/2,
                    height:6,width:6,vx:10,vy:-2
                });
            }
            if (e.key in keysRef.current && e.key === "ArrowUp") {
                keysRef.current[e.key as keyof typeof keysRef.current] = true;

            }


        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof typeof keysRef.current] = false;
            }
        };

        const createChar = (color: string, pos: any) => {
            ctx.fillStyle = color;
            ctx.fillRect(pos.x, pos.y, character.width, character.height);
        }



        const boundaryChecker = (blue: Character, red: Character) => {
            const helper = (color:Character)=>{
                color.y = Math.max(0, Math.min(color.y, canvas.height - character.height));
                if (color.y >= canvas.height - 100) {
                    color.y = canvas.height - 100;
                    color.vy = 0;
                    blueisJumping = false
                }
                const onTopOfPlatform =
                    color.y + character.height <= stage.y + color.vy && // was above lastframe
                    color.y + character.height + color.vy >= stage.y && // is now hitting
                    color.x + character.width > stage.x &&
                    color.x < stage.x + stage.width;
                if (onTopOfPlatform) {
                    color.y = stage.y - character.height;
                    color.vy = 0;
                }
                
            }
            helper(blue)
            helper(red)
        }

        const renderGame = () => {
            // Clear and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //stage draw
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(stage.x, stage.y, stage.width, stage.height)
        }


        const handleProjectileMovement = ()=>{;
            const arr = projectilesRef.current;
            const red = redCharacter.current;
            const insideChar = (pro:ProjectileRef)=>{
                if(pro.x >red.x&&pro.x <red.x+character.width){
                    if(pro.y> red.y&& pro.y< red.y+character.height){
                        return true
                    }
                }
            }
            if(arr.length){
                for(let i=0; i< arr.length;i++){
                    const pro = arr[i];
                    //if statement controls when delete
                    if(pro.x>= canvas.width){
                        arr.splice(i,1);
                        continue;
                    }

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
        }

        const renderProjectile = ()=>{
            const arr = projectilesRef.current;
            for(let i=0;i<arr.length;i++){
                const pro = arr[i];
                ctx.fillStyle = 'black';
                ctx.fillRect(pro.x,pro.y,pro.width, pro.height)
            }
        }


        const checkProColision = ()=>{
            const pros = projectilesRef.current;
            const blue = blueCharacter.current;
            const red = redCharacter.current;

            for(let i=0; i<pros.length; i++){
                const projec = pros[i]
                const collidingChar = projec.x
            }
        }

        const gameLoop = () => {
            const blue:Character = blueCharacter.current;
            const red:Character = redCharacter.current;
            //Apply Gravity
            blue.vy += gravity;
            red.vy += gravity;
            blue.y += blue.vy;
            red.y += red.vy;


            // Enforce boundaries of map, stage, and projectile.
            boundaryChecker(blue, red);
            handleProjectileMovement();
            checkProColision();

            //render all the stuff lol
            renderGame();
            renderProjectile();
            createChar("blue", blue);
            createChar("red", red)

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

