
interface CharacterInt {
    x: number;
    y: number;
    vx: number;
    vy: number;
    jumping: boolean;
    color: "red" | "blue"
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


class Character implements CharacterInt {
    x: number;
    y: number;
    vx: number;
    vy: number;
    jumping: boolean;
    color: "red" | "blue";

    static height = 100;
    static width = 50;
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

    addGravity(gravity: number) {
        this.vy = this.vy + gravity;
        this.y = this.y + this.vy;
    }
    boundaryChecker({ canvas, stage }: BoundaryChecker) {
        this.y = Math.max(0, Math.min(this.y, canvas.height - Character.height));
        if (this.y >= canvas.height - Character.height) {
            this.y = canvas.height - Character.height;
            this.vy = 0;
            this.jumping = false
        }
        const onTopOfPlatform =
            this.y + Character.height <= stage.y + this.vy && // was above lastframe
            this.y + Character.height + this.vy >= stage.y && // is now hitting
            this.x + Character.width > stage.x &&
            this.x < stage.x + stage.width;
        if (onTopOfPlatform) {
            this.y = stage.y - Character.height;
            this.vy = 0;
        }
    }
    renderCharacter(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, Character.width, Character.height);
    }
}

export default Character;