import { Body, Box, Vec2, RevoluteJoint } from "planck";
import { CHARACTER } from "../utils/constants";
import { world } from "../engine/world";

export default function createArm(character: Body) {

    const armOffset = new Vec2(0, 0);

    const arm = world.createBody({
        type: 'dynamic',
        position: Vec2.add(character.getPosition(), armOffset),
        angularDamping: 0.2,
    });
    
    arm.createFixture(new Box(0.1, 0.5), { density: 1 });
    
    const joint = new RevoluteJoint({
        bodyA: character,
        bodyB: arm,
        localAnchorA: armOffset,
        localAnchorB: new Vec2(0, 0.5), // Top of arm
        collideConnected: false,
        maxMotorTorque: 20,
        motorSpeed: 0,
        enableMotor: true,
        lowerAngle: -Math.PI / 4,
        upperAngle: Math.PI / 4,
    });
    
    return { arm, joint: world.createJoint(joint) };
}