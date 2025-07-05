import { Body, Vec2 } from "planck";
import { Bounds, WorldBounds, FixtureUserData } from "../utils/types";

class SpatialPartitioningGrid {
    private grid: Map<string, Set<Body>> = new Map();
    private cellSize: number;
    private worldBounds: WorldBounds;
    
    constructor(cellSize: number = 100, worldBounds: WorldBounds) {
        this.cellSize = cellSize;
        this.worldBounds = worldBounds;
    }
    
    // Convert world position to grid coordinates
    private worldToGrid(x: number, y: number): { gridX: number, gridY: number } {
        return {
            gridX: Math.floor(x / this.cellSize),
            gridY: Math.floor(y / this.cellSize)
        };
    }
    
    // Convert grid coordinates to cell key
    private gridToKey(gridX: number, gridY: number): string {
        return `${gridX},${gridY}`;
    }
    
    // Get all grid cells an object occupies
    private getObjectCells(body: Body): string[] {
        const pos = body.getPosition();
        const bounds = this.getBodyBounds(body);
        
        const minGrid = this.worldToGrid(bounds.minX, bounds.minY);
        const maxGrid = this.worldToGrid(bounds.maxX, bounds.maxY);
        
        const cells: string[] = [];
        for (let x = minGrid.gridX; x <= maxGrid.gridX; x++) {
            for (let y = minGrid.gridY; y <= maxGrid.gridY; y++) {
                cells.push(this.gridToKey(x, y));
            }
        }
        return cells;
    }
    
    private getBodyBounds(body: Body): Bounds {
        const pos = body.getPosition();
        const bodyType = this.getBodyType(body);
        
        // Use appropriate radius based on body type
        let radius = 20; // Default radius
        switch (bodyType) {
            case 'character':
                radius = 40; // Character radius
                break;
            case 'projectile':
                radius = 10; // Projectile radius
                break;
            case 'arm':
                radius = 30; // Arm radius
                break;
            default:
                radius = 20; // Default
        }
        
        return {
            minX: pos.x - radius,
            maxX: pos.x + radius,
            minY: pos.y - radius,
            maxY: pos.y + radius,
            width: radius * 2,
            height: radius * 2,
            x: pos.x,
            y: pos.y
        };
    }
    
    // Update object position in grid
    updateObject(body: Body): void {
        // Remove from old cells
        this.removeObject(body);
        
        // Add to new cells
        const cells = this.getObjectCells(body);
        cells.forEach(cellKey => {
            if (!this.grid.has(cellKey)) {
                this.grid.set(cellKey, new Set());
            }
            this.grid.get(cellKey)!.add(body);
        });
    }
    
    // Remove object from all cells
    removeObject(body: Body): void {
        this.grid.forEach(cell => {
            cell.delete(body);
        });
    }
    
    // Get all objects in nearby cells
    getNearbyObjects(body: Body, radius: number = 0): Body[] {
        const pos = body.getPosition();
        const bounds = this.getBodyBounds(body);
        
        // Expand search area by radius
        const searchBounds = {
            minX: bounds.minX - radius,
            maxX: bounds.maxX + radius,
            minY: bounds.minY - radius,
            maxY: bounds.maxY + radius
        };
        
        const minGrid = this.worldToGrid(searchBounds.minX, searchBounds.minY);
        const maxGrid = this.worldToGrid(searchBounds.maxX, searchBounds.maxY);
        
        const nearby = new Set<Body>();
        
        for (let x = minGrid.gridX; x <= maxGrid.gridX; x++) {
            for (let y = minGrid.gridY; y <= maxGrid.gridY; y++) {
                const cellKey = this.gridToKey(x, y);
                const cell = this.grid.get(cellKey);
                if (cell) {
                    cell.forEach(objInCell => {
                        if (objInCell !== body) {
                            nearby.add(objInCell);
                        }
                    });
                }
            }
        }
        
        return Array.from(nearby);
    }
    
    // Optimized collision detection for projectiles
    checkProjectileCollisions(body: Body): Body[] {
        const nearby = this.getNearbyObjects(body, 20); // 20px search radius
        return nearby.filter(obj => {
            // Quick AABB check first
            if (!this.aabbOverlap(this.getBodyBounds(body), this.getBodyBounds(obj))) {
                return false;
            }
            
            // Detailed collision check only if AABB overlaps
            return this.detailedCollisionCheck(body, obj);
        });
    }
    
    private aabbOverlap(a: Bounds, b: Bounds): boolean {
        return !(a.maxX < b.minX || a.minX > b.maxX || 
                a.maxY < b.minY || a.minY > b.maxY);
    }
    
    private detailedCollisionCheck(a: Body, b: Body): boolean {
        // Get type from user data or fixtures
        const aType = this.getBodyType(a);
        const bType = this.getBodyType(b);
        
        if (aType === 'projectile' && bType === 'character') {
            return this.projectileCharacterCollision(a, b);
        }
        return false;
    }
    
    private getBodyType(body: Body): string {
        // Check fixtures for type information
        let fixtures = body.getFixtureList();
        while (fixtures) {
            const userData = fixtures.getUserData() as FixtureUserData;
            if (userData?.type) return userData.type;
            fixtures = fixtures.getNext();
        }
        return 'unknown';
    }
    
    private projectileCharacterCollision(projectile: Body, character: Body): boolean {
        const projPos = projectile.getPosition();
        const charPos = character.getPosition();
        const distance = Math.sqrt((projPos.x - charPos.x) ** 2 + (projPos.y - charPos.y) ** 2);
        const radius = 20; // Use fixed radius since getRadius doesn't exist
        return distance < (radius + radius);
    }
}
export default SpatialPartitioningGrid