# rooftop-shooters-clone
This is a clone of the game rooftop shooters. https://poki.com/en/g/rooftop-snipers

# Improving Code Structure and Performance in Your Canvas Game

This guide provides a step-by-step approach to reorganizing and optimizing your game's code structure for better maintainability, clarity, and performance. It focuses on the game you’re building using the Canvas API and React.

---

## 1. Organize Game Entities Into Classes or Modules

**Purpose:** Reduce repeated logic and encapsulate behavior of characters, arms, and projectiles.

### Steps:

1. Create separate files or modules for each game entity: Character, Arm, and Projectile.
2. Define properties and methods inside each module that relate to that entity’s behavior (e.g., movement, rendering, updates).
3. Use a factory or class-based structure to instantiate these entities within the main game loop.
4. Replace raw `useRef` objects with instances of these organized entities.

---

## 2. Modularize the Game Loop

**Purpose:** Keep your game loop clean and maintainable by separating rendering, updating, and input handling.

### Steps:

1. Create separate modules for rendering logic (e.g., background, characters, projectiles, UI).
2. Create another set of modules for update logic (e.g., apply gravity, check collisions, move projectiles).
3. In your main game loop, call these functions in a clear order: input → update → collision detection → render.
4. This separation makes debugging and feature additions significantly easier.

---

## 3. Encapsulate Collision Logic

**Purpose:** Avoid repeating collision detection logic and make it reusable across different entity interactions.

### Steps:

1. Create a utility module for collision detection.
2. Add functions like `isColliding(rect1, rect2)` that abstract the math behind the detection.
3. Use these functions wherever collisions are needed (e.g., between characters and projectiles, or characters and platforms).
4. This will reduce bugs and simplify testing of collision-related logic.

---

## 4. Use a Game State Manager

**Purpose:** Manage different game states (e.g., playing, paused, game over) clearly and efficiently.

### Steps:

1. Define an enum or object to represent game states.
2. Store the current state in a global or context-level variable.
3. Use conditional logic in the game loop to check the current state before processing input or rendering.
4. Implement state transitions through clearly named functions (e.g., `startGame()`, `endGame()`, `resetGame()`).

---

## 5. Optimize Performance With Object Pooling

**Purpose:** Minimize memory allocation and garbage collection during gameplay.

### Steps:

1. Instead of creating and destroying objects like projectiles every frame, reuse them from a pre-allocated pool.
2. When a projectile is no longer active (e.g., it goes off-screen), reset its properties and return it to the pool.
3. Pull from the pool when you need a new projectile instead of creating a new object.
4. This reduces memory pressure and can prevent performance hiccups.

---

## 6. Improve Readability With Constants and Configs

**Purpose:** Avoid magic numbers and make the game tunable via a single location.

### Steps:

1. Create a `config.ts` or `constants.ts` file.
2. Move hardcoded values like gravity, jump strength, canvas size, and character dimensions into this file.
3. Import these values where needed instead of redefining them.
4. This allows for easier tuning and a cleaner main game file.

---

## 7. Use Animation Libraries for Smooth Motion (Optional)

**Purpose:** Enhance visuals with smoother animations.

### Steps:

1. Consider using lightweight animation libraries if frame-based calculations become complex.
2. Use requestAnimationFrame only for essential update loops and offload transitions to libraries if needed.
3. This is particularly useful for UI animations like health bars, score counters, etc.

---

By following these steps, your game's structure will become much easier to scale and maintain as it grows. You'll also benefit from improved performance and clarity in your codebase.
