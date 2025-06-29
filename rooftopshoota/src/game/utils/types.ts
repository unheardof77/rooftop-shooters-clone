import { Body, RevoluteJoint } from "planck";

export interface Keys {
    w: boolean;
    e: boolean;
    i: boolean;
    o: boolean;
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