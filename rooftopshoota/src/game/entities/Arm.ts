import { Body, Box, Vec2, RevoluteJoint } from "planck";
import { world } from "../engine/world";
import { CHARACTER, METER, ARM_LENGTH } from "../utils/constants";

export default function createArm(character: Body) {
    //attach to top of character
    const armOffset = new Vec2(0, CHARACTER.height / 2);

    const arm = world.createBody({
        type: 'dynamic',
        position: character.getWorldPoint(armOffset),
        angularDamping: 0.2,
        angle: character.getAngle()
    });
    const halfLength = ARM_LENGTH / 2;
    arm.createFixture(new Box(0.1, halfLength, new Vec2(0, -halfLength)), {
        density: 1
    });
    const joint = new RevoluteJoint({
        bodyA: character,
        bodyB: arm,
        localAnchorA: armOffset,
        localAnchorB: new Vec2(0, 0), // Top of arm
        collideConnected: false,
        maxMotorTorque: 20,
        motorSpeed: 0,
        enableMotor: true,
        lowerAngle: -Math.PI / 4,
        upperAngle: Math.PI / 4,
        referenceAngle:0
    });
    
    return { arm, joint: world.createJoint(joint) };
}