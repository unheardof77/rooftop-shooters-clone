# rooftop-shooters-clone
This is a clone of the game rooftop shooters. (Link)[https://poki.com/en/g/rooftop-snipers]
# ✅ To-Do Checklist: Adding Projectiles
🟢 Setup
 Create a data structure (e.g. array) to store active projectiles.

 Add an event listener for a shoot key (like Spacebar or Z).

## 🔫 Firing
 On key press, create a new projectile:

Store its position (e.g., from the character’s center).

Assign a velocity for movement (e.g., horizontal speed).

## 🚀 Game Loop Updates
 In the game loop, update the position of each projectile using its velocity.

 Check if any projectiles have moved off-screen.

 Remove off-screen projectiles from the array.

## 🎯 Rendering
 Draw each projectile to the canvas using its current position.

## 🧠 Optional Features
 Add a firing rate limiter (cooldown) to avoid bullet spam.

 Store the direction the player is facing and fire accordingly.

 Add projectile gravity or angled shots (if needed later).

 Setup projectile collision detection with other game objects.
# ✅ To-Do Checklist: Tracking Projectile Collisions
## 🟨 Setup
 Define objects that projectiles can collide with (e.g. enemies).

 Store their position and size (x, y, width, height) in an array or object list.

## 🟨 Collision Detection Logic
 In each frame of the game loop:

Loop through all projectiles.

For each projectile, loop through all targets.

Use Axis-Aligned Bounding Box (AABB) collision detection:

Check if the projectile's rectangle overlaps a target's rectangle.

## 🟨 On Collision
 If a collision is detected:

Remove the projectile from the array.

Optionally remove or update the hit target (e.g., reduce health or remove if destroyed).

Trigger visual or sound feedback if desired.

## 🟨 Optimization (Optional)
 Use spatial partitioning (like grids or quadtrees) if you have many projectiles and targets.

 Batch-remove collided projectiles and objects after the main loop to avoid index bugs.