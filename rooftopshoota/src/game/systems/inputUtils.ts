import { Keys, CreateHandleEscapeKey, GameStatus } from '../utils/types';


export function createHandleKeyDown(keysRef: React.RefObject<Keys>) {
    return (e: KeyboardEvent) => {
        if (e.key in keysRef.current) {
            keysRef.current[e.key as keyof Keys] = true;
        }
    };
}

export function createHandleKeyUp(keysRef: React.RefObject<Keys>) {
    return (e: KeyboardEvent) => {
        if (e.key in keysRef.current) {
            keysRef.current[e.key as keyof Keys] = false;
        }
    };
}

export function createHandleEscapeKey({setGameStatus}:CreateHandleEscapeKey) {
    return (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setGameStatus((last:GameStatus) => {
                if(last.gameStatus === "playing"){
                    return { ...last, gameStatus: "paused" };
                }else if(last.gameStatus === "paused"){
                    return { ...last, gameStatus: "playing" };
                }else {
                    return {...last}
                }
            });
        }
    };
}