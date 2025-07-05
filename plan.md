# Prioritized Gameplay Improvement Plan: Rooftop Shooters

## Overview
This plan prioritizes core gameplay fixes first, then new mechanics, then visual enhancements. Each phase builds upon the previous one to create a solid, engaging game experience.

---

## **Phase 1: Core Gameplay Fixes (Priority 1)**

### **Week 1: Critical Bug Fixes & Core Mechanics**

#### **Day 1-2: Projectile System Overhaul**
**Goal**: Fix projectile collision detection and scoring system

**Implementation Tasks**:
- Fix projectile collision detection in `contactListeners.ts`
  - Add proper collision response between projectiles and characters
  - Implement hit registration that increments score
  - Ensure projectiles are destroyed on impact
  - Add collision sound effects and visual feedback

**Code Changes**:
```typescript
// In contactListeners.ts - add projectile collision handling
world.on('begin-contact', (contact) => {
    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();
    const aData = fixtureA.getUserData();
    const bData = fixtureB.getUserData();
    
    // Handle projectile-character collisions
    if ((aData?.type === "projectile" && bData?.type === "character") ||
        (bData?.type === "projectile" && aData?.type === "character")) {
        // Increment score, destroy projectile, add hit effects
    }
});
```

#### **Day 3-4: Character Health System**
**Goal**: Implement health system and damage mechanics

**Implementation Tasks**:
- Add health property to characters (3-5 hits)
- Implement damage indicators (character flashing)
- Create respawn system with invulnerability period
- Add health bar UI elements

**Code Changes**:
```typescript
// In Character.ts - add health system
interface CharacterHealth {
    current: number;
    max: number;
    invulnerable: boolean;
    invulnerabilityTimer: number;
}
```

#### **Day 5-7: Physics Improvements**
**Goal**: Fix character physics and movement issues

**Implementation Tasks**:
- Reduce excessive character rolling by adjusting stabilization forces
- Improve landing detection and reduce bounce
- Add character tilt limits
- Enhance jump mechanics with better air control

**Code Changes**:
```typescript
// In constants.ts - adjust physics values
export const CHARACTER = {
    // ... existing properties
    maxTiltAngle: Math.PI / 6, // 30 degrees
    stabilizationForce: 20, // Reduced from 50
    landingThreshold: 0.5, // Reduced bounce
};
```

---

## **Phase 2: New Gameplay Mechanics (Priority 2)**

### **Week 2: Advanced Mechanics & Systems**

#### **Day 8-9: Projectile Cooldown System**
**Goal**: Implement fire rate limiting and different projectile types

**Implementation Tasks**:
- Add fire rate limiting to prevent spam shooting
- Create visual cooldown indicator on arms
- Implement different projectile types (fast/slow, high/low damage)
- Add reload animation/feedback

**Code Changes**:
```typescript
// In ProjectileSystem.ts - add cooldown system
interface ProjectileType {
    name: string;
    cooldown: number;
    damage: number;
    speed: number;
    color: string;
}
```

#### **Day 10-11: Power-ups System**
**Goal**: Add power-ups to enhance gameplay variety

**Implementation Tasks**:
- Implement rapid fire power-up (reduced cooldown)
- Add speed boost power-up (faster movement)
- Create shield power-up (temporary invulnerability)
- Add power-up spawn system with visual indicators

**Code Changes**:
```typescript
// New file: PowerUpSystem.ts
export class PowerUpSystem {
    private activePowerUps: Map<string, PowerUp> = new Map();
    
    spawnPowerUp(type: PowerUpType, position: Vec2): void {
        // Spawn power-up at position
    }
    
    applyPowerUp(character: Body, type: PowerUpType): void {
        // Apply power-up effects
    }
}
```

#### **Day 12-14: Environmental Hazards**
**Goal**: Add environmental elements to increase gameplay complexity

**Implementation Tasks**:
- Implement moving platforms
- Add wind effects that affect projectile trajectory
- Create temporary obstacles that appear/disappear
- Add environmental damage zones

**Code Changes**:
```typescript
// New file: EnvironmentSystem.ts
export class EnvironmentSystem {
    private movingPlatforms: Body[] = [];
    private windForce: Vec2 = new Vec2(0, 0);
    
    updateWind(): void {
        // Update wind direction and force
    }
    
    applyWindToProjectiles(): void {
        // Apply wind effects to projectiles
    }
}
```

---

## **Phase 3: Visual Enhancements (Priority 3)**

### **Week 3: Visual Polish & Feedback**

#### **Day 15-16: Screen Shake & Impact Effects**
**Goal**: Add visual feedback for impacts and actions

**Implementation Tasks**:
- Implement screen shake when projectiles hit characters
- Create impact particle effects at collision points
- Add muzzle flash effects when firing
- Implement recoil animation for arms

**Code Changes**:
```typescript
// In OptimizedDrawUtils.ts - add screen shake
export class ScreenShake {
    private intensity: number = 0;
    private duration: number = 0;
    
    shake(intensity: number, duration: number): void {
        this.intensity = intensity;
        this.duration = duration;
    }
    
    update(deltaTime: number): Vec2 {
        // Calculate shake offset
    }
}
```

#### **Day 17-18: Character Animations**
**Goal**: Add smooth animations for character movement

**Implementation Tasks**:
- Implement idle animation (slight breathing motion)
- Add jump animation with arm movement
- Create landing animation with dust particles
- Add damage animation (character shake/flash)

**Code Changes**:
```typescript
// New file: AnimationSystem.ts
export class AnimationSystem {
    private animations: Map<string, Animation> = new Map();
    
    playAnimation(character: Body, animationName: string): void {
        // Play character animation
    }
    
    updateAnimations(deltaTime: number): void {
        // Update all active animations
    }
}
```

#### **Day 19-21: UI Improvements**
**Goal**: Enhance user interface and game flow

**Implementation Tasks**:
- Redesign score display with better typography
- Add health bars with smooth animations
- Implement pause menu with options
- Create game over screen with restart option

**Code Changes**:
```typescript
// In OptimizedDrawUtils.ts - improve UI
public drawHealthBar(character: Body, health: number, maxHealth: number): void {
    // Draw animated health bar
}

public drawPauseMenu(): void {
    // Draw pause menu with options
}
```

---

## **Quick Wins (Can be implemented in 1-2 hours each)**

### **Immediate Improvements**:
1. **Add simple hit effects** - Red flash when character is hit
2. **Implement basic health bars** - Simple colored rectangles
3. **Add fire rate limiting** - Basic cooldown timer
4. **Improve score display** - Better positioning and styling
5. **Add pause functionality** - Basic pause/resume

### **Medium-term Improvements**:
6. **Implement screen shake** - Simple camera shake on impacts
7. **Add character direction indicators** - Arrow showing facing direction
8. **Create basic power-up** - Simple speed boost
9. **Add sound effects** - Basic jump, shoot, hit sounds
10. **Implement simple animations** - Character idle breathing

---

## **Implementation Timeline**

### **Week 1: Core Fixes**
- Days 1-2: Projectile collision & scoring
- Days 3-4: Health system
- Days 5-7: Physics improvements

### **Week 2: New Mechanics**
- Days 8-9: Cooldown system
- Days 10-11: Power-ups
- Days 12-14: Environmental hazards

### **Week 3: Visual Polish**
- Days 15-16: Screen shake & effects
- Days 17-18: Character animations
- Days 19-21: UI improvements

---

## **Success Metrics**

### **Core Gameplay**:
- ✅ Projectiles properly hit and damage characters
- ✅ Health system prevents instant death
- ✅ Characters have smooth, controlled movement
- ✅ Game has clear win/lose conditions

### **New Mechanics**:
- ✅ Multiple projectile types available
- ✅ Power-ups add strategic depth
- ✅ Environmental elements increase complexity
- ✅ Game feels balanced and fair

### **Visual Polish**:
- ✅ Clear visual feedback for all actions
- ✅ Smooth animations enhance gameplay
- ✅ UI is intuitive and informative
- ✅ Game looks professional and polished

---

## **Follow-up Question**
Which specific core gameplay fix would you like to tackle first - the projectile collision system, the health system, or the physics improvements? This will help me provide more detailed implementation guidance for your chosen starting point.