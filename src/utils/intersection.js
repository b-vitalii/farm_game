export function isIntersecting(spriteA, spriteB) {
    const a = spriteA.getBounds();
    const b = spriteB.getBounds();

    return (
        a.x + a.width > b.x &&
        a.x < b.x + b.width &&
        a.y + a.height > b.y &&
        a.y < b.y + b.height
    );
}
