export class Vector2 {
    constructor(public x: number, public y: number) { }

    public distance(vec: Vector2) {
        return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
    }

    public inRadius(vec: Vector2, radius: number) {
        return this.distance(vec) < radius;
    }

    public debugPrint() {
        return `Vec2(${this.x}, ${this.y})`;
    }
}
