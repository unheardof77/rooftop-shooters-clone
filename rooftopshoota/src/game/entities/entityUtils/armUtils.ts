import { AddArmMotorControl } from "../../utils/types";


export function addArmMotorControl({keysRef, blueJoint, redJoint}:AddArmMotorControl) {
    if (keysRef.current.e) {
        blueJoint?.setMotorSpeed(-1);
    } else {
        blueJoint?.setMotorSpeed(0);
    }
    if (keysRef.current.o) {
        redJoint?.setMotorSpeed(1);
    } else {
        redJoint?.setMotorSpeed(0);
    }
}