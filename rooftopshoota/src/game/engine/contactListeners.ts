import { world } from './world';
import planck from 'planck';


export const registerContacts = (characterBody: planck.Body, ground: planck.Body) => {
    let canJump:boolean = false;//global variable for each character to determine if they can jump

    world.on('begin-contact', (contact) => {
        const a = contact.getFixtureA().getBody();
        const b = contact.getFixtureB().getBody();
        if ((a === characterBody && b === ground) || (b === characterBody && a === ground)) {
            canJump = true;
        }
    });

    world.on('end-contact', (contact) => {
        const a = contact.getFixtureA().getBody();
        const b = contact.getFixtureB().getBody();
        if ((a === characterBody && b === ground) || (b === characterBody && a === ground)) {
            canJump = false;
        }
    });
    return () => {
        const ableToJump = canJump;
        return ableToJump;
    }
};