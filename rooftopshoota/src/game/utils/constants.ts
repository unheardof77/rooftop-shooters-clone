import { Vec2Value, Vec2 } from "planck";

export const GRAVITY = -5;
export const METER = 30; // 50px = 1 meter 
export const JUMP_IMPULSE:Vec2Value = new Vec2(0, 100);
export const PROJECTILE_SPEED = 20;
export const STAGE = { x: 250, y: 400, width: 500, height: 400 };
export const ARM_ROTATION_SPEED = 0.02;
export const ARM_LENGTH = 1; // in meters
export const CHARACTER = { width:50, height:100 }
export const PROJECTILE = { width:6, height:6 }
export const CANVAS = { width:1000, height:800 }