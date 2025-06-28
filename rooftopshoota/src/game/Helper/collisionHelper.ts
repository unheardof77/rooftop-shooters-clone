import Character from "../Classes/Character";
import Projectile from "../Classes/Projectile";

interface CollisionHelper {
    projectile: Projectile;
    character: Character;
}

export default function collisionHelper({projectile, character}:CollisionHelper){
    return     projectile.x > character.x
            && projectile.x < character.x + Character.width
            && projectile.y > character.y 
            && projectile.y < character.y + Character.height;
}