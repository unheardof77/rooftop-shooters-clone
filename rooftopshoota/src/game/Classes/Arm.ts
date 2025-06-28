

interface ArmInt {
    angle: number; // in radians
    charging: boolean;
    owner: 'blue' | 'red';
    x: number;
    y: number;
}

interface Position {
    x: number;
    y: number;
}

import Character from "./Character";

import { rotationSpeed, armLength } from "../variables";


class Arm implements ArmInt {
    angle: number; // in radians
    charging: boolean;
    owner: 'blue' | 'red';
    x: number;
    y: number;
    static rotationSpeed = rotationSpeed;
    static armLength = armLength;

    constructor({ angle, charging, owner, x, y }: ArmInt) {
        this.angle = angle;
        this.charging = charging;
        this.owner = owner;
        this.x = x;
        this.y = y;
    }

    get position() {
        return { x: this.x, y: this.y }
    }
    get getAngle() {
        return this.angle;
    }
    get getOwner() {
        return this.owner;
    }
    get getCharging() {
        return this.charging;
    }

    set setPosition({ x, y }: Position) {
        if(this.owner === "blue"){
            this.x = x +Character.width;
            this.y = y +Character.height/2;
        }else {
            this.x = x;
            this.y = y +Character.height/2;
        }
    }
    set setAngle(angle: number) {
        this.angle = angle;
    }
    set setCharging(charge: boolean) {
        this.charging = charge;
    }

    animateArm() {
        if (this.charging && this.angle > 0 && this.owner === "blue") {
            this.setAngle = this.angle - Arm.rotationSpeed;
        }
        if (this.charging && this.angle > 0 && this.owner === "red") {
            this.setAngle = this.angle + Arm.rotationSpeed;
        }
    }
    renderArm(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Move origin to the shoulder (pivot point)
    ctx.translate(this.x, this.y);

    // Rotate around the new origin
    ctx.rotate(this.angle);

    // Draw the arm as a rectangle or line FROM the pivot (0,0) outward
    ctx.fillStyle = 'black';
    ctx.fillRect(0, -2, Arm.armLength, 4); // horizontal arm, centered on y-axis

    ctx.restore();
    }
}

export default Arm;