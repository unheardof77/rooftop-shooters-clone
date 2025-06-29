import { Body } from 'planck';
import { STABILIZATION_FORCE } from '../utils/constants';

export const stabilizeCharacter = (character: Body) => {
    const angle = character.getAngle();
    const angularVelocity = character.getAngularVelocity();

    // Only apply stabilization when needed
    if (Math.abs(angle) > 0.5 || Math.abs(angularVelocity) > 0.5) {
        // Apply restoring torque to return to upright position
        const torque = -angle * STABILIZATION_FORCE - angularVelocity * 10;
        character.applyTorque(torque);
    }
};