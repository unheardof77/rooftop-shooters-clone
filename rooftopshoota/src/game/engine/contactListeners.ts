import { world } from './world';
import { Vec2 } from 'planck';
import { LANDING_THRESHOLD, ROLL_MULTIPLIER } from '../utils/constants';



export const registerContacts = () => {
    let contactCount = 0; // Track multiple contacts

    world.on('begin-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const aData = fixtureA.getUserData() as { type?: string };
        const bData = fixtureB.getUserData() as { type?: string };

        // Check for character bottom touching ground
        if (
            (aData?.type === "characterBottom" && bData?.type === "ground") ||
            (bData?.type === "characterBottom" && aData?.type === "ground")
        ) {
            contactCount++;
        }
        const bothCharacters =
            (aData?.type === "characterBottom" && bData?.type === "characterBottom") ||
            (aData?.type === "characterTop" && bData?.type === "characterTop");

        if (bothCharacters) {
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
        // Projectile hits character
        if ((aData?.type === "projectile" && bData?.type === "character") ||
            (bData?.type === "projectile" && aData?.type === "character")) {

            const projectile = aData?.type === "projectile"
                ? fixtureA.getBody()
                : fixtureB.getBody();

            // Mark projectile for removal
            projectile.setUserData({ shouldRemove: true });

            // Add damage effects here
            }
        });

    world.on('end-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const aData = fixtureA.getUserData() as { type?: string };
        const bData = fixtureB.getUserData() as { type?: string };

        if (
            (aData?.type === "characterBottom" && bData?.type === "ground") ||
            (bData?.type === "characterBottom" && aData?.type === "ground")
        ) {
            contactCount = Math.max(0, contactCount - 1);
        }
    });

    world.on('post-solve', contact => {
        const fixtures = [contact.getFixtureA(), contact.getFixtureB()];
        fixtures.forEach(fixture => {
            const data = fixture.getUserData() as { type?: string };

            if (data?.type === 'characterBottom') {
                const character = fixture.getBody();
                const velocity = character.getLinearVelocity();
                console.log(`Character velocity: ${velocity.x}, ${velocity.y}`);
                // Detect landing
                if (Math.abs(velocity.y) > LANDING_THRESHOLD) {
                    // Only apply horizontal roll, not vertical bounce
                    const rollTorque = velocity.x * ROLL_MULTIPLIER;
                    character.applyTorque(rollTorque);
                }
            }
        });
    });
    return () => contactCount > 0;
};
