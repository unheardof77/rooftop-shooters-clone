import { Body, RevoluteJoint, Vec2 } from "planck";

export interface Keys {
    w: boolean;
    e: boolean;
    i: boolean;
    o: boolean;
    Escape: boolean;
}

export interface PhysicsState {
    position: Vec2;
    angle: number;
    linearVelocity: Vec2;
    angularVelocity: number;
    timestamp: number;
}

export interface Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface ProjectileSystem {
    ctx: CanvasRenderingContext2D;
    blueArm: Body; 
    redArm: Body; 
    blueCharacter: Body; 
    redCharacter: Body; 
    keysRef: React.RefObject<Keys>;
    prevKeysRef: React.RefObject<Keys>;
    projectilesRef: React.RefObject<Body[]>;
    spatialGrid?: any;
}

export interface PosCords {
    x: number; // x position in canvas pixels
    y: number; // y position in canvas pixels
}

export interface DrawStage {
    scC: {
        x: number; // stage center x position in canvas pixels
        y: number; // stage center y position in canvas pixels
    }
    cwC: number; // canvas width in pixels
    chC: number; // canvas height in pixels
}

export interface AddArmMotorControl {
    keysRef: React.RefObject<{ e: boolean; o: boolean, i:boolean, w:boolean }>;
    blueJoint: RevoluteJoint |null;
    redJoint: RevoluteJoint |null;
}

export interface AddCharacterJump {
    canBlueJump: () => boolean;
    canRedJump: () => boolean;
    blueCharacter: Body;
    redCharacter: Body;
    keysRef: React.RefObject<{ w: boolean; e: boolean; i: boolean; o: boolean }>;
    jumpState: {
        blue: {
            isJumping: boolean;
            startTime: number;
            lastJumpTime: number;
        };
        red: {
            isJumping: boolean;
            startTime: number;
            lastJumpTime: number;
        };
    };
}

export interface CreateStage {
    canvasWidth: number;
    canvasHeight: number;
}

export interface RenderArms {
    blueArm:Body;
    redArm:Body;
    blueCharacter:Body;
    redCharacter:Body;
}

export interface RenderCharacters {
    blueCharacter:Body;
    redCharacter:Body;
}

export interface GameStatus {
    gameStatus: "playing" | "paused" | "gameOver";
    score: {
        blue: number;
        red: number;
    };
}

export interface CreateHandleEscapeKey {
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
}

export type Color = "blue" | "red";

export interface DirtyRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TrackedObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface RenderStats {
    fps: number;
    drawCalls: number;
    dirtyRegions: number;
    culledObjects: number;
}

export interface PhysicsObject {
    getPosition(): Vec2;
    getAngle(): number;
    getBounds(): Bounds;
    getRadius(): number;
    type: string;
    setUserData(data: any): void;
    getUserData(): any;
}

export interface OptimizationSystems {
    physicsInterpolator: any;
    spatialGrid: any;
    frameController: any;
}

export interface InterpolatedState {
    position: Vec2;
    angle: number;
    linearVelocity: Vec2;
    angularVelocity: number;
    timestamp: number;
}