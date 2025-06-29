import { world } from './world';

export const stepPhysics = () => {
    const timeStep = 1 / 60;
    world.step(timeStep);
};