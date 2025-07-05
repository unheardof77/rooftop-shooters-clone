import { Body, RevoluteJoint, Vec2 } from "planck";

// ============================================================================
// 1. COLLISION & PHYSICS TYPES
// ============================================================================

// Bounds for collision detection and rendering
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

// Collision detection result
export interface CollisionResult {
    collided: boolean;
    distance?: number;
    overlap?: number;
}

// Physics state for interpolation
export interface PhysicsState {
    position: Vec2;
    angle: number;
    linearVelocity: Vec2;
    angularVelocity: number;
    timestamp: number;
}

// World bounds for spatial partitioning
export interface WorldBounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

// ============================================================================
// 2. ENTITY & GAME OBJECT TYPES
// ============================================================================

// Entity creation parameters
export interface ArmParams {
    character: Body;
    color: Color;
}

export interface CharacterParams {
    x: number;
    y: number;
    color: Color;
}

export interface ProjectileParams {
    x: number;
    y: number;
    angle: number;
    color: ProjectileType;
    speed?: number;
}

// Game entity interface (replacing the generic PhysicsObject)
export interface GameEntity {
    getPosition(): Vec2;
    getAngle(): number;
    getBounds(): Bounds;
    getRadius(): number;
    type: EntityType;
    setUserData(data: FixtureUserData): void;
    getUserData(): FixtureUserData;
}

// Stage creation interface
export interface CreateStage {
    canvasWidth: number;
    canvasHeight: number;
}

// ============================================================================
// 3. ENUMS & CONSTANTS
// ============================================================================

export enum CharacterSubtype {
    TOP = 'top',
    BOTTOM = 'bottom'
}

export enum Color {
    BLUE = 'blue',
    RED = 'red'
}

export enum EntityType {
    CHARACTER = 'character',
    PROJECTILE = 'projectile',
    ARM = 'arm',
    GROUND = 'ground',
    STAGE = 'stage'
}

export enum GameStatusType {
    PLAYING = "playing",
    PAUSED = "paused",
    GAME_OVER = "gameOver"
}

export enum ProjectileType {
    BLUE = 'blue',
    RED = 'red'
}

// ============================================================================
// 4. GAME STATE & SCORING TYPES
// ============================================================================

// Game status and scoring
export interface GameStatus {
    gameStatus: GameStatusType;
    score: Score;
}

export interface Score {
    blue: number;
    red: number;
}

// ============================================================================
// 5. INPUT & CONTROL TYPES
// ============================================================================

// Arm motor control interface
export interface AddArmMotorControl {
    keysRef: React.RefObject<Keys>;
    blueJoint: RevoluteJoint | null;
    redJoint: RevoluteJoint | null;
}

// Character jump control interface
export interface AddCharacterJump {
    canBlueJump: () => boolean;
    canRedJump: () => boolean;
    blueCharacter: Body;
    redCharacter: Body;
    keysRef: React.RefObject<Keys>;
    jumpState: CharacterJumpState;
}

export interface MountInputSystem {
    keysRef: React.RefObject<Keys>;
    prevKeysRef: React.RefObject<Keys>;
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
    blueJoint: RevoluteJoint | null;
    redJoint: RevoluteJoint | null;
}

// Input handling
export interface Keys {
    w: boolean;
    e: boolean;
    i: boolean;
    o: boolean;
    Escape: boolean;
}

// Jump state for characters
export interface CharacterJumpState {
    blue: JumpState;
    red: JumpState;
}

export interface JumpState {
    isJumping: boolean;
    startTime: number;
    lastJumpTime: number;
}

// ============================================================================
// 6. OPTIMIZATION & PERFORMANCE TYPES
// ============================================================================

// Frame rate controller interface
export interface FrameRateController {
    shouldUpdate(): boolean;
    update(): void;
}

// Game loop update callback
export interface GameLoopCallback {
    (deltaTime: number): void;
}

// Interpolated state for smooth rendering
export interface InterpolatedState {
    position: Vec2;
    angle: number;
    linearVelocity: Vec2;
    angularVelocity: number;
    timestamp: number;
}

// Optimization systems with proper typing
export interface OptimizationSystems {
    physicsInterpolator: PhysicsInterpolator;
    spatialGrid: SpatialPartitioningGrid;
    frameController: FrameRateController;
}

// Physics interpolator interface
export interface PhysicsInterpolator {
    updatePhysics(deltaTime: number): void;
    getInterpolatedState(body: Body): PhysicsState | null;
}

// Spatial partitioning grid interface
export interface SpatialPartitioningGrid {
    updateObject(body: Body): void;
    removeObject(body: Body): void;
    getNearbyObjects(body: Body, radius?: number): Body[];
    checkProjectileCollisions(body: Body): Body[];
}

// ============================================================================
// 7. RENDERING & VISUAL TYPES
// ============================================================================

// Drawing stage information
export interface DrawStage {
    scC: {
        x: number; // stage center x position in canvas pixels
        y: number; // stage center y position in canvas pixels
    }
    cwC: number; // canvas width in pixels
    chC: number; // canvas height in pixels
}

// Position coordinates
export interface PosCords {
    x: number; // x position in canvas pixels
    y: number; // y position in canvas pixels
}

// Rendering interfaces
export interface RenderArms {
    blueArm: Body;
    redArm: Body;
    blueCharacter: Body;
    redCharacter: Body;
}

export interface RenderCharacters {
    blueCharacter: Body;
    redCharacter: Body;
}

// Rendering optimization types
export interface DirtyRegion {
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

export interface TrackedObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ============================================================================
// 8. USER DATA & FIXTURE TYPES
// ============================================================================

export interface ArmUserData {
    type: EntityType.ARM;
    color: Color;
}

export interface CharacterUserData {
    type: EntityType.CHARACTER;
    subtype: CharacterSubtype;
    color?: Color;
}

export interface GroundUserData {
    type: EntityType.GROUND;
}

export interface ProjectileUserData {
    type: EntityType.PROJECTILE;
    color: ProjectileType;
    damage?: number;
}

export type FixtureUserData = CharacterUserData | ProjectileUserData | GroundUserData | ArmUserData;

// ============================================================================
// 9. UI & INTERACTION TYPES
// ============================================================================

export interface CreateHandleEscapeKey {
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
}