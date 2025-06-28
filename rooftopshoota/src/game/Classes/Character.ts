import Arm from "./Arm";
import { character, stage } from "../variables";

interface CharacterInt {
    x: number;
    y: number;
    vx: number;
    vy: number;
    jumping: boolean;
    color: "red" | "blue";

}

interface Position {
    x: number;
    y: number;
}

interface Velocity {
    vx: number;
    vy: number;
}

interface BoundaryChecker {
    canvas: HTMLCanvasElement;
    stage: {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}
interface AttachArm {
    arm: Arm;
}

interface DetectGround {
    stage: typeof stage
}
interface AddRotation {
    stage: typeof stage
}

class Character implements CharacterInt {
    x: number;
    y: number;
    vx: number;
    vy: number;
    jumping: boolean;
    color: "red" | "blue";
    rotation: number = 0;
    rv: number = 0;

    static height = character.height;
    static width = character.width;
    constructor({ color, x, y, vx, vy, jumping }: CharacterInt) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.jumping = jumping;
        this.color = color
    }

    get position() {
        return { x: this.x, y: this.y }
    }
    get velocity() {
        return { vx: this.vx, vy: this.vy }
    }
    get isJumping() {
        return this.jumping
    }

    set setPosition({ x, y }: Position) {
        this.x = x;
        this.y = y;
    }
    set setVelocity({ vx, vy }: Velocity) {
        this.vx = vx;
        this.vy = vy;
    }
    set setJumping(jumping: boolean) {
        this.jumping = jumping;
    }

    detectGround({ stage }: DetectGround) {
        return (
            this.y + Character.height <= stage.y + this.vy && // was above lastframe
            this.y + Character.height + this.vy >= stage.y && // is now hitting
            this.x + Character.width > stage.x &&
            this.x < stage.x + stage.width
        )
    }

    addGravity(gravity: number) {

        const maxFallSpeed = 20;
        this.vy = Math.min(this.vy + gravity, maxFallSpeed);
        this.y = this.y + this.vy;
        // this.vx = this.vx + gravity;
        // this.x = this.x + this.vx;
    }
    addRotation({ stage }: AddRotation) {
        if (this.y >= stage.height) {
            if (this.jumping) {
                this.rv = 0.1 * (Math.random() > 0.5 ? 1 : -1)
            }
            this.rotation = this.rotation + this.rv;
            this.rv = this.rv * 0.9;//dampening
        }
        if (Math.abs(this.rotation) < 0.01) {
            this.rotation = 0;
            this.rv = 0;
        }
    }
    boundaryChecker({ canvas, stage }: BoundaryChecker) {
        this.y = Math.max(0, Math.min(this.y, canvas.height - Character.height));
        if (this.y >= canvas.height - Character.height) {
            this.y = canvas.height - Character.height;
            this.vy = 0;
            this.jumping = false
        }

        if (this.detectGround({ stage })) {
            this.y = stage.y - Character.height;
            this.vy = 0;
        }
    }
    attachArm({ arm }: AttachArm) {
        arm.setPosition = { x: this.x, y: this.y }
    }

    renderCharacter(ctx: CanvasRenderingContext2D) {
        ctx.save();
        if(this.jumping){
            ctx.translate(this.x + character.width / 2, this.y + character.height / 2); // pivot at center
            ctx.rotate(this.rotation);
            ctx.translate(-character.width / 2, -character.height / 2);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, Character.width, Character.height);
        ctx.restore();
    }
}

export default Character;