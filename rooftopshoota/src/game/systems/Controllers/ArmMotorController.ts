import { RevoluteJoint } from "planck";


export default class ArmMotorController {
    blueJoint: RevoluteJoint | null;
    redJoint: RevoluteJoint | null;
    constructor(blueJoint: RevoluteJoint | null, redJoint: RevoluteJoint | null){
        this.blueJoint = blueJoint;
        this.redJoint = redJoint;
    }

    enableBlueMotor(speed: number){
        if(!this.blueJoint){ console.error("Blue joint not initialized"); return;}
        this.blueJoint.enableMotor(true);
        this.blueJoint.setMotorSpeed(-speed);
    }
    enableRedMotor(speed: number){
        if(!this.redJoint){ console.error("Red joint not initialized"); return;}
        this.redJoint.enableMotor(true);
        this.redJoint.setMotorSpeed(speed);
    }
    disableBlueMotor(){
        if(!this.blueJoint){ console.error("Blue joint not initialized"); return;}
        this.blueJoint.setMotorSpeed(0);
        this.blueJoint.enableMotor(false);
    }
    disableRedMotor(){
        if(!this.redJoint){ console.error("Red joint not initialized"); return;}
        this.redJoint.setMotorSpeed(0);
        this.redJoint.enableMotor(false);
    }
}