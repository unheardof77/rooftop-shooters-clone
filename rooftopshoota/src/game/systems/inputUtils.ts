import { Keys } from '../utils/types';


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