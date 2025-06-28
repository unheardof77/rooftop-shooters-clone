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


class Arm implements ArmInt {
    angle: number; // in radians
    charging: boolean;
    owner: 'blue' | 'red';
    x: number;
    y: number;
    static rotationSpeed = 0.02;
    static armLength = 50;

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
        this.x = x;
        this.y = y;
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
        const armOrigin = this.owner === "blue" ? { x: this.x + Character.width, y: this.y + (Character.height / 2) } : { x: this.x, y: this.y + (Character.height / 2) }
        const x = armOrigin.x + Arm.armLength * Math.cos(this.angle);
        const y = armOrigin.y - Arm.armLength * Math.sin(this.angle);
        ctx.beginPath();
        ctx.moveTo(armOrigin.x, armOrigin.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();

    }
}

export default Arm;