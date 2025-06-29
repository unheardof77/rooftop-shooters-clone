import { Body, Box, Vec2, RevoluteJoint, Joint } from "planck";
import { CHARACTER, METER } from "../utils/constants";
import { world } from "../engine/world";


export default function createArm(character: Body){
    const characterPos = character.getPosition();
    const armOffset = new Vec2(0, -CHARACTER.height/2 /METER)

    const armWrldPos = Vec2.add(characterPos, armOffset);

    const arm = world.createBody({
        type: 'dynamic',
        position: armWrldPos,
        angularDamping: 0.2,
    });
    arm.createFixture(new Box(0.1, 0.5), { density: 1 });
    const anchor = Vec2.add(characterPos, armOffset);
    const joint = world.createJoint(new RevoluteJoint({
        bodyA: character,
        bodyB: arm,
        localAnchorA: armOffset,
        localAnchorB: new Vec2(0, 0),
        collideConnected: false,
    }));
    return {arm, joint};
}