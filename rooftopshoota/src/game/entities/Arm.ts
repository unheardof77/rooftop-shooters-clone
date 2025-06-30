import { Body, Box, Vec2, RevoluteJoint } from "planck";
import { world } from "../engine/world";
import { CHARACTER, ARM_LENGTH, ARM_DAMPENING } from "../utils/constants";
import { GROUND_CATEGORY, ARM_MASK } from "../utils/collisionGroups";

export  function createArm(character: Body) {
    //attach to top of character - moved higher to avoid gun collision with character bottom
    const armOffset = new Vec2(0, CHARACTER.height * 0.9);

    const arm = world.createBody({
        type: 'dynamic',
        position: character.getWorldPoint(armOffset),
        angle: character.getAngle(),
        angularDamping: ARM_DAMPENING,
    });
    // Create arm shape extending DOWNWARD from attachment point
    const halfLength = ARM_LENGTH / 2;
    arm.createFixture(new Box(0.1, halfLength, new Vec2(0, -halfLength)), {
        density: 1,
        filterCategoryBits: GROUND_CATEGORY, // Character category
        filterMaskBits: ARM_MASK, // Collide with ground and projectiles
    });
    const joint = new RevoluteJoint({
        bodyA: character,
        bodyB: arm,
        localAnchorA: armOffset,
        localAnchorB: new Vec2(0, 0), // Top of arm
        collideConnected: false,
        maxMotorTorque: 200,
        motorSpeed: 0,
        enableMotor: true,
        referenceAngle:0
    });

    world.createJoint(joint) 
    return { arm, joint};
}