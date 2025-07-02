import { Vec2, Body } from 'planck';
import { clampJumpAngle } from '../../utils/helpers';
import { JUMP_COOLDOWN, JUMP_IMPULSE, JUMP_SUSTAIN_FORCE, MAX_JUMP_DURATION, HORIZONTAL_JUMP_FACTOR } from '../../utils/constants';
import { AddCharacterJump, GameStatus, Color } from '../../utils/types';
import { world } from '../../engine/world';


export function addCharacterJump({ canBlueJump, canRedJump, blueCharacter, redCharacter, keysRef, jumpState }: AddCharacterJump) {
    if (canBlueJump() && keysRef.current.w) {
        const now = Date.now();
        if (now - jumpState.blue.lastJumpTime > JUMP_COOLDOWN && !jumpState.blue.isJumping) {
            // Start jump
            jumpState.blue.isJumping = true;
            jumpState.blue.lastJumpTime = Date.now();

            let angle = blueCharacter.getAngle();
            angle = clampJumpAngle(angle);

            // Calculate jump direction
            const jumpDirection = new Vec2(
                Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                Math.cos(angle)
            );

            // Apply initial impulse
            blueCharacter.applyLinearImpulse(
                jumpDirection.mul(JUMP_IMPULSE),
                blueCharacter.getWorldCenter()
            );
        } else {
            // Apply sustained force if still within jump duration
            const elapsed = Date.now() - jumpState.blue.startTime;
            if (elapsed < MAX_JUMP_DURATION) {
                let angle = blueCharacter.getAngle();
                angle = clampJumpAngle(angle);

                const jumpDirection = new Vec2(
                    Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                    Math.cos(angle)
                );

                // Apply continuous force instead of impulse
                blueCharacter.applyForceToCenter(
                    jumpDirection.mul(JUMP_SUSTAIN_FORCE)
                );
            }
        }
    } else {
        jumpState.blue.isJumping = false;
    }

    // Handle red character jumping
    if (canRedJump() && keysRef.current.i) {
        const now = Date.now();
        if (now - jumpState.red.lastJumpTime > JUMP_COOLDOWN && !jumpState.red.isJumping) {
            // Start jump
            jumpState.red.isJumping = true;
            jumpState.red.lastJumpTime = Date.now();

            let angle = redCharacter.getAngle();
            angle = clampJumpAngle(angle);

            // Calculate jump direction
            const jumpDirection = new Vec2(
                Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                Math.cos(angle)
            );

            // Apply initial impulse
            redCharacter.applyLinearImpulse(
                jumpDirection.mul(JUMP_IMPULSE),
                redCharacter.getWorldCenter()
            );
        } else {
            // Apply sustained force if still within jump duration
            const elapsed = Date.now() - jumpState.red.startTime;
            if (elapsed < MAX_JUMP_DURATION) {
                let angle = redCharacter.getAngle();
                angle = clampJumpAngle(angle);

                const jumpDirection = new Vec2(
                    Math.sin(angle) * HORIZONTAL_JUMP_FACTOR,
                    Math.cos(angle)
                );

                // Apply continuous force instead of impulse
                redCharacter.applyForceToCenter(
                    jumpDirection.mul(JUMP_SUSTAIN_FORCE)
                );
            }   
        }
    } else {
        jumpState.red.isJumping = false;
    }
}

