export const GRAVITY = -5;
export const METER = 30; // 50px = 1 meter 
export const STAGE = { x: 250, y: 400, width: 500, height: 400 };
export const ARM_ROTATION_SPEED = 0.02;
export const ARM_LENGTH = 1; // in meters
export const ARM = {
    width: 0.1,
    height: 1,
    color: 'black'
}
export const CHARACTER = {
    width: 0.8,     // Physics units (meters)
    height: 2.0,    // Physics units (meters)
    radius: 0.5,     // Physics units (meters)
    bottom:{
        density: 3,
        friction: 0.3,
        restitution: 0.2
    },
    top: {
        density:1,
        friction: 0.2,
    },
    dampening:0.0
};
export const PROJECTILE = {
    radius: 0.1,
    speed:10,
    density: 50,
    restitution: 0.8,
}
export const CANVAS = { width: 1000, height: 800 }
export const JUMP_SUSTAIN_FORCE = 10;
export const MAX_JUMP_DURATION = 300; // ms
export const LANDING_THRESHOLD = 1; // Minimum velocity for roll
export const ROLL_MULTIPLIER = 50; // Roll intensity
export const PHYSICS_CONFIG = {
    stabilizationForce: 50,
    angularDamping: 0.8,
    bottomDensity: 3.0,
    topDensity: 0.5
};
export const STABILIZATION_FORCE = 10;
export const JUMP_IMPULSE = 10; // Total jump force magnitude
export const HORIZONTAL_JUMP_FACTOR = 0.5; // Ratio of horizontal to vertical force
export const MAX_JUMP_ANGLE = Math.PI/2; // 60 degrees maximum tilt for jumping
export const JUMP_COOLDOWN = 500; // ms cooldown
export const PROJECTILE_RADIUS = 0.1; // Physics units (meters)
export const PROJECTILE_SPEED = 10;   // Physics units per second
export const PROJECTILE_KNOCKBACK = 0.3; 
export const ARM_DAMPENING = 1.0;