import { world } from './world';
import { Vec2 } from 'planck';
import { LANDING_THRESHOLD, ROLL_MULTIPLIER } from '../utils/constants';
import { Color } from '../utils/types';

let jumpTracker = {blue:false, red:false}

export const registerContacts = () => {

    const canBlueJump = () => {
        return jumpTracker.blue;
    }
    const canRedJump = () => {
        return jumpTracker.red;
    }

    world.on('begin-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const aData = fixtureA.getUserData() as { type?: string, color?: Color };
        const bData = fixtureB.getUserData() as { type?: string, color?: Color };

        // Check for if its a character touching ground
        if ((aData?.type === "character" && bData?.type === "ground") ||
            (bData?.type === "character" && aData?.type === "ground")) {
            if(aData?.color){
                jumpTracker[aData.color] = true;
            }else if(bData?.color){
                jumpTracker[bData.color] = true;
            }
        }
        // Check for if its a character touching another character
        if (aData?.type === "character" && bData?.type === "character") {
            const bodyA = fixtureA.getBody();
            const bodyB = fixtureB.getBody();

            // Calculate bounce direction
            const dir = Vec2.sub(bodyA.getPosition(), bodyB.getPosition());
            dir.normalize();

            // Apply elastic response
            const impulse = new Vec2(15, 0);
            bodyA.applyLinearImpulse(impulse, bodyA.getWorldCenter());
            bodyB.applyLinearImpulse(impulse.neg(), bodyB.getWorldCenter());
        }
        // Projectile collision detection now handled by spatial grid for better performance
        });

    world.on('end-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const aData = fixtureA.getUserData() as { type?: string, color?: Color };
        const bData = fixtureB.getUserData() as { type?: string, color?: Color };

        if (
            (aData?.type === "character" && bData?.type === "ground") ||
            (bData?.type === "character" && aData?.type === "ground")
        ) {
            if(aData?.color){
                jumpTracker[aData.color] = false;
            }else if(bData?.color){
                jumpTracker[bData.color] = false;
            }
        }
    });

    world.on('post-solve', contact => {
        const fixtures = [contact.getFixtureA(), contact.getFixtureB()];
        fixtures.forEach(fixture => {
            const data = fixture.getUserData() as { subtype?: string };

            if (data?.subtype === 'bottom') {
                const character = fixture.getBody();
                const velocity = character.getLinearVelocity();
                // Detect landing
                if (Math.abs(velocity.y) > LANDING_THRESHOLD) {
                    // Only apply horizontal roll, not vertical bounce
                    const rollTorque = velocity.x * ROLL_MULTIPLIER;
                    character.applyTorque(rollTorque);
                }
            }
        });
    });
    return [canBlueJump, canRedJump];
};
