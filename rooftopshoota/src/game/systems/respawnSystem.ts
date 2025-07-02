import { Body, Vec2 } from "planck";
import { returnCharacterSpawnPositions } from "../utils/helpers";
import { GameStatus } from "../utils/types";

function checkCharacterFall(character: Body) {
    const data = character.getUserData() as {isDead: boolean};
    const position = character.getPosition();
    if(position.y <= 0){
        character.setUserData({...data, isDead: true});
        return true;
    } else {
        return false;
    }
}

export function respawnSystem(blueCharacter: Body, redCharacter: Body, setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>) {
    const spawnPositions = returnCharacterSpawnPositions();
    const blueFall = checkCharacterFall(blueCharacter);
    const redFall = checkCharacterFall(redCharacter);
    if(redFall){
        setGameStatus((last:GameStatus) => {
            const newBlueScore = last.score.blue + 1;
            if(newBlueScore >= 3){
                return {...last, gameStatus: "gameOver", score: {
                    blue: newBlueScore,
                    red: last.score.red
                }};
            }
            return {...last, gameStatus: "playing", score: {
                blue: newBlueScore,
                red: last.score.red
            }};
        });
    }
    if(blueFall){
        setGameStatus((last:GameStatus) => {
            const newRedScore = last.score.red + 1;
            if(newRedScore >= 3){
                return {...last, gameStatus: "gameOver", score: {
                    blue: last.score.blue,
                    red: newRedScore
                }};
            }
            return {...last, gameStatus: "playing", score: {
                blue: last.score.blue,
                red: newRedScore
            }};
        });
    }

    if(redFall || blueFall){
        blueCharacter.setLinearVelocity(new Vec2(0, 0));
        redCharacter.setLinearVelocity(new Vec2(0, 0));
        blueCharacter.setPosition(new Vec2(spawnPositions.bx, spawnPositions.by));
        redCharacter.setPosition(new Vec2(spawnPositions.rx, spawnPositions.ry));
    }
}