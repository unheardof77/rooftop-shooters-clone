// Collision Filter Categories
// These define which objects can collide with each other using bitwise operations

// Category bits - each entity type gets its own category
export const COLLISION_CATEGORIES = {
    GROUND: 0x0001,      // Stage/ground objects
    GUN: 0x0002,         // Gun objects
    PROJECTILE: 0x0004,  // Projectile objects
    // Note: Character and Arm both use 0x0001 (same as GROUND)
    // This allows them to collide with each other
} as const;

// Mask bits - define what each category can collide with
export const COLLISION_MASKS = {
    GROUND: COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.PROJECTILE,  // Ground collides with character/arm and projectiles
    CHARACTER: COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.PROJECTILE,  // Character collides with ground and projectiles
    ARM: COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.PROJECTILE,  // Arm collides with ground and projectiles
    GUN: COLLISION_CATEGORIES.GROUND,  // Gun only collides with ground (not character/arm due to filterGroupIndex)
    PROJECTILE: COLLISION_CATEGORIES.GROUND,  // Projectiles collide with character/ground
} as const;

// Group index for special collision behavior
export const COLLISION_GROUPS = {
    GUN: -1,  // Negative group index prevents collision with character/arm
} as const;

// Convenience exports for direct use
export const {
    GROUND: GROUND_CATEGORY,
    GUN: GUN_CATEGORY,
    PROJECTILE: PROJECTILE_CATEGORY
} = COLLISION_CATEGORIES;

export const {
    GROUND: GROUND_MASK,
    CHARACTER: CHARACTER_MASK,
    ARM: ARM_MASK,
    GUN: GUN_MASK,
    PROJECTILE: PROJECTILE_MASK
} = COLLISION_MASKS;

export const {
    GUN: GUN_GROUP
} = COLLISION_GROUPS;
