"use client"
import { useRef, useEffect, useState } from 'react';

export default function CanvasGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState({ x: 100, y: 100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        canvas.width = 800;
        canvas.height = 600;

        let animationFrameId: number;
        const speed = 5;

        const character = { width: 50, height: 50 };
        const stage = {width: 400, height: 300};

        const keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keys) keys[e.key as keyof typeof keys] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keys) keys[e.key as keyof typeof keys] = false;
        };

        const render = () => {
            // Update position based on keys pressed
            const newPos = { ...position };
            if (keys.ArrowUp) newPos.y -= speed;
            if (keys.ArrowDown) newPos.y += speed;
            if (keys.ArrowLeft) newPos.x -= speed;
            if (keys.ArrowRight) newPos.x += speed;
            setPosition(newPos);

            // Clear and redraw create background
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'skyblue';
            context.fillRect(0, 0, canvas.width, canvas.height);
            //create stage
            context.fillStyle = 'darkblue';
            context.fillRect(200, 300, stage.width, stage.height)
            
            //create one charcter
            context.fillStyle = 'red';
            context.fillRect(newPos.x, newPos.y, character.width, character.height);

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
    }, [position]);

    return <canvas ref={canvasRef} />;
}

