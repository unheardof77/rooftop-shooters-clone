# rooftop-shooters-clone
This is a clone of the game rooftop shooters. https://poki.com/en/g/rooftop-snipers

# Folder Structure Breakdown 
![folder structure](./assets/folderStructure.png)

# Installation
  - ```CD rooftopshoota && npm install```
  - setup a next-env.d.ts on the same level as next.config.ts
    - paste ```/// <reference types="next" />``` on line one.
    - paste ```/// <reference types="next/image-types/global" />``` on line two.

Start development journey with ```npm run dev```.

# Types.ts file breakdown. (July 2, 2025)

### **Type Groups (Alphabetical Order):**

1. **COLLISION & PHYSICS TYPES**
    - Bounds, CollisionResult, PhysicsState, WorldBounds

2. **ENTITY & GAME OBJECT TYPES**
    - ArmParams, CharacterParams, CreateStage, GameEntity, ProjectileParams

3. **ENUMS & CONSTANTS**
    - CharacterSubtype, Color, EntityType, GameStatusType, ProjectileType

4. **GAME STATE & SCORING TYPES**
    - GameStatus, Score

5. **INPUT & CONTROL TYPES**
    - AddArmMotorControl, AddCharacterJump, CharacterJumpState, JumpState, Keys

6. **OPTIMIZATION & PERFORMANCE TYPES**
    - FrameRateController, GameLoopCallback, InterpolatedState, OptimizationSystems, PhysicsInterpolator, SpatialPartitioningGrid

7. **RENDERING & VISUAL TYPES**
    - DrawStage, PosCords, RenderArms, RenderCharacters, DirtyRegion, RenderStats, TrackedObject

8. **USER DATA & FIXTURE TYPES**
    - ArmUserData, CharacterUserData, GroundUserData, ProjectileUserData, FixtureUserData

9. **UI & INTERACTION TYPES**
    - CreateHandleEscapeKey
