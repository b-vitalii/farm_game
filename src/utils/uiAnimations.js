export function tadaED(obj) {
    const scale0 = obj.scale.x;
    const rotation0 = obj.rotation;
    const tl = gsap.timeline();

    tl.to(obj.scale, { x: scale0 * 1.5, y: scale0 * 1.5, duration: 0.25, ease: "power2.out" });
    tl.to(obj, { rotation: rotation0 - 0.1, duration: 0.25, ease: "power2.out" }, "<");

    tl.to(obj, {
        duration: 0.5,
        onUpdate: function () {
            const progress = this.progress();
            obj.rotation = rotation0 + Math.sin(progress * Math.PI * 4) * 0.15;
        }
    });

    tl.to(obj.scale, { x: scale0, y: scale0, duration: 0.1, ease: "power2.out" });
    tl.to(obj, { rotation: rotation0, duration: 0.1, ease: "power2.out" }, "<");

    return tl;
}

export function bounceFromED(obj) {
    const y0 = obj.y;
    obj.y = y0 + 1000;

    return gsap.to(obj, {
        y: y0,
        duration: 1.5,
        delay: 0.5,
        ease: "bounce.out",
        onComplete: () => pulseED(obj)
    });
}

export function pulseED(obj) {
    const scale0 = obj.scale.x;

    return gsap.to({ angle0: 0 }, {
        angle0: Math.PI,
        duration: 1,
        ease: "none",
        repeat: -1,
        onUpdate: function () {
            const angle = this.targets()[0].angle0;
            const scaleOffset = Math.sin(angle) * 0.03;
            obj.scale.set(scale0 + scaleOffset);
        }
    });
}

export function animateDropTarget(obj3D) {
    gsap.to(obj3D.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
    });
}
