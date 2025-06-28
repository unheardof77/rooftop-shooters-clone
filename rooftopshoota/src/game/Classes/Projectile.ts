import Character from "./Character";

import collisionHelper from "../Helper/collisionHelper";

import { projectile } from "../variables";

interface ProjectileInt {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface Position {
    x: number;
    y: number;
}

interface Velocity {
    vx: number;
    vy: number;
}



interface HandleProjectileMovement {
    red: Character;
    blue: Character;
    refarr: Projectile[];
    canvas: HTMLCanvasElement;
    i: number;
}
interface IsInside {
    red: Character;
    blue: Character;
}

class Projectile implements ProjectileInt {
    x: number;
    y: number;
    vx: number;
    vy: number;

    static width = projectile.width;
    static height = projectile.height;

    constructor({ x, y, vx, vy }: ProjectileInt) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    get position() {
        return { x: this.x, y: this.y }
    }
    get velocity() {
        return { vx: this.vx, vy: this.vy }
    }

    set setPosition({ x, y }: Position) {
        this.x = x;
        this.y = y;
    }
    set setVelocity({ vx, vy }: Velocity) {
        this.vx = vx;
        this.vy = vy;
    }

    isInside({ red, blue }: IsInside): boolean {
        const hitRed = collisionHelper({projectile:this, character:red})
        const hitBlue = collisionHelper({projectile:this, character:blue})
        return hitRed || hitBlue;
    }

    handleProjectileMovement({ red, blue, refarr, canvas, i }: HandleProjectileMovement) {
        //if statement controls when delete on x axis
        if (this.x >= canvas.width || this.x <= 0) {
            refarr.splice(i, 1);
            return;
        }
        //if statement controls when delete on y axis
        if (this.y <= 0 || this.y >= canvas.height) {
            refarr.splice(i, 1);
            return;
        }
        // delete if inside a character
        if (this.isInside({ red, blue })) {
            refarr.splice(i, 1);
            return;
        }
        //moves the position of the this
        this.x = this.x + this.vx
        this.y = this.y + this.vy
    }
    renderProjectile(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, Projectile.width, Projectile.height)
    }
}

export default Projectile;