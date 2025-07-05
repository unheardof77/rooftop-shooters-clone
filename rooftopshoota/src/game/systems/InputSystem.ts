import { HORIZONTAL_JUMP_FACTOR, JUMP_COOLDOWN, JUMP_IMPULSE, JUMP_SUSTAIN_FORCE, MAX_JUMP_DURATION } from '../utils/constants';
import { Keys, GameStatus, CharacterJumpState, CreateHandleEscapeKey, GameStatusType, Color } from '../utils/types';
import { Body, RevoluteJoint, Vec2 } from 'planck';
import { clampJumpAngle } from '../utils/helpers';
import ArmMotorController from './Controllers/ArmMotorController';


export default class InputSystem {
    currentKeys: React.RefObject<Keys>;
    prevKeys: React.RefObject<Keys>;
    jumpState: CharacterJumpState;
    armMotorController: ArmMotorController;
    constructor(keysRef: React.RefObject<Keys>, prevKeys: React.RefObject<Keys>, blueJoint: RevoluteJoint | null, redJoint: RevoluteJoint | null) {
        this.currentKeys = keysRef;
        this.prevKeys = prevKeys;
        this.jumpState = {
            blue: { isJumping: false, startTime: 0, lastJumpTime: 0 },
            red: { isJumping: false, startTime: 0, lastJumpTime: 0 }
        };
        this.armMotorController = new ArmMotorController(blueJoint, redJoint);
    }

    createHandleKeyDown(keysRef: React.RefObject<Keys>) {
        return (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof Keys] = true;
            }
        };
    }
    createHandleKeyUp(keysRef: React.RefObject<Keys>) {
        return (e: KeyboardEvent) => {
            if (e.key in keysRef.current) {
                keysRef.current[e.key as keyof Keys] = false;
            }
        };
    }
    createHandleEscapeKey({setGameStatus}:CreateHandleEscapeKey) {
        return (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setGameStatus((last:GameStatus) => {
                    if(last.gameStatus === GameStatusType.PLAYING){
                        return { ...last, gameStatus: GameStatusType.PAUSED };
                    }else if(last.gameStatus === GameStatusType.PAUSED){
                        return { ...last, gameStatus: GameStatusType.PLAYING };
                    }else {
                        return {...last}
                    }
                });
            }
        };
    }

    initialize({setGameStatus}:CreateHandleEscapeKey) {
        
        return {
            handleKeyDown: this.createHandleKeyDown(this.currentKeys),
            handleKeyUp: this.createHandleKeyUp(this.currentKeys),
            handleEscapeKey: this.createHandleEscapeKey({setGameStatus})
        }
    }
    iskeypressed(key: keyof Keys){
        return this.currentKeys.current[key] 
    }
    isKeyJustPressed(key: keyof Keys){
        return this.prevKeys.current[key] 
    }
    isKeyJustReleased(key: keyof Keys){
        return !this.currentKeys.current[key] && this.prevKeys.current[key]
    }
    updateKeyStates(){
        this.prevKeys.current = {...this.currentKeys.current}
        this.currentKeys.current = {
            w: false,
            e: false,
            i: false,
            o: false,
            Escape: false
        }
    }
    clearJumpState(color:Color){
        this.jumpState[color].isJumping = false;
        this.jumpState[color].startTime = 0;
        this.jumpState[color].lastJumpTime = 0;
    }

    handleJump(character:Body, color:Color, canJump:()=>boolean){
        const now = Date.now();
        console.log("canJump" +color, canJump());
        if(now - this.jumpState[color].lastJumpTime > JUMP_COOLDOWN && !this.jumpState[color].isJumping && canJump()){
            this.jumpState[color].isJumping = true;
            this.jumpState[color].lastJumpTime = now;
            const clampedAngle = clampJumpAngle(character.getAngle());
            const jumpDirection = new Vec2(
                Math.sin(clampedAngle) * HORIZONTAL_JUMP_FACTOR,
                Math.cos(clampedAngle)
            );
            character.applyLinearImpulse(jumpDirection.mul(JUMP_IMPULSE), character.getWorldCenter());
        } else {
            const elapsed = Date.now() - this.jumpState[color].startTime;
            if(elapsed < MAX_JUMP_DURATION){
                const clampedAngle = clampJumpAngle(character.getAngle());
                const jumpDirection = new Vec2(
                    Math.sin(clampedAngle) * HORIZONTAL_JUMP_FACTOR,
                    Math.cos(clampedAngle)
                );
                character.applyForceToCenter(jumpDirection.mul(JUMP_SUSTAIN_FORCE));
            }else {
                this.clearJumpState(color);
            }
        }
    }
    handleCharacterJump(canBlueJump: () => boolean, canRedJump: () => boolean, blueCharacter: Body, redCharacter: Body){
        if(this.iskeypressed("w") && this.iskeypressed("i")){
            this.jumpState.blue.startTime = Date.now();
            this.handleJump(blueCharacter, Color.BLUE, canBlueJump);
            this.jumpState.red.startTime = Date.now();
            this.handleJump(redCharacter, Color.RED, canRedJump);
        }else if(this.iskeypressed("w")){
            this.jumpState.blue.startTime = Date.now();
            this.handleJump(blueCharacter, Color.BLUE, canBlueJump);
        }else if(this.iskeypressed("i")){
            this.jumpState.red.startTime = Date.now();
            this.handleJump(redCharacter, Color.RED, canRedJump);
        }else {
            // Clear jump states when no jump keys are pressed
            if(this.jumpState.blue.isJumping){
                this.clearJumpState(Color.BLUE);
            }
            if(this.jumpState.red.isJumping){
                this.clearJumpState(Color.RED);
            }
        }
    }
    handleArmMotorControl(){
        if(this.iskeypressed("e") && this.iskeypressed("o")){
            this.armMotorController?.enableBlueMotor(1);
            this.armMotorController?.enableRedMotor(1);
        }else if(this.iskeypressed("e")){
            this.armMotorController?.enableBlueMotor(1);
        }else if(this.iskeypressed("o")){
            this.armMotorController?.enableRedMotor(1);
        }else {
            this.armMotorController?.disableBlueMotor();
            this.armMotorController?.disableRedMotor();
        }
    }
    handleProjectileFire(blueArm: Body, redArm: Body, blueCharacter: Body, redCharacter: Body, fireProjectile: (arm: Body, character: Body)=>void){
        if(this.isKeyJustReleased("e") && this.isKeyJustReleased("o")){
            fireProjectile(blueArm, blueCharacter);
            fireProjectile(redArm, redCharacter);
        } else if(this.isKeyJustReleased("e")){
            fireProjectile(blueArm, blueCharacter);
        } else if(this.isKeyJustReleased("o")){
            fireProjectile(redArm, redCharacter);
        }
    }
}