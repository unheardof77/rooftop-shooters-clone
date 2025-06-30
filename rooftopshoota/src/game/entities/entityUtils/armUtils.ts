import { AddArmMotorControl } from "../../utils/types";


export function addArmMotorControl({keysRef, blueJoint, redJoint}:AddArmMotorControl) {
    if (keysRef.current.e) {
        blueJoint?.enableMotor(true);
        blueJoint?.setMotorSpeed(-1);
    } else {
        blueJoint?.setMotorSpeed(0);
        blueJoint?.enableMotor(false);
    }
    if (keysRef.current.o) {
        redJoint?.enableMotor(true);
        redJoint?.setMotorSpeed(1);
    } else {
        redJoint?.setMotorSpeed(0);
        redJoint?.enableMotor(false);
    }
}