# rooftop-shooters-clone
This is a clone of the game rooftop shooters. https://poki.com/en/g/rooftop-snipers

# Improving Code Structure and Performance in Your Canvas Game

This guide provides a step-by-step approach to reorganizing and optimizing your game's code structure for better maintainability, clarity, and performance. It focuses on the game you’re building using the Canvas API and React.

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

