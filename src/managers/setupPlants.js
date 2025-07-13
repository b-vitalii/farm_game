import { plantConfig } from '../data/ObjectConfig.js';

export function setupPlants({ root, spawner, dropZonesMap, showObjects }) {
    const get = name => root.getObjectByName(name);
    const setPos = (obj, [x, y, z]) => obj?.position.set(x, y, z);
    const setScale = (obj, [x, y, z]) => obj?.scale.set(x, y, z);

    const objects = {};

    // 🔹 Стаціонарні об’єкти
    for (const key of ['fence', 'ground']) {
        const cfg = plantConfig[key];
        const obj = get(key);
        if (obj) {
            setScale(obj, cfg.scale);
            setPos(obj, cfg.position);
            objects[key] = obj;
        }
    }

    for (const category of ['strawberry', 'corn', 'tomato', 'grape']) {
        objects[category] = [];

        for (const cfg of plantConfig[category]) {
            const obj = get(cfg.name);
            if (obj) {
                setPos(obj, cfg.position);
                objects[category].push(obj);
            }
        }

        showObjects[category].push(...objects[category]);
    }

    const grapeClones = plantConfig.grapeClones.map(cfg =>
        spawner.spawnPlant({
            name: cfg.name,
            position: cfg.position,
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        })
    );

    showObjects.grape.push(...grapeClones);
    dropZonesMap.grape.push(objects.grape[0], grapeClones[1]); // grape1 + grapeClone2
    objects.grapeClones = grapeClones;

    const strawberryClones = plantConfig.strawberryClones.map(cfg =>
        spawner.spawnPlant({
            name: cfg.name,
            position: cfg.position,
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        })
    );

    showObjects.strawberry.push(...strawberryClones);
    dropZonesMap.strawberry.push(objects.strawberry[0], strawberryClones[4]); // strawberry1 + clone5
    objects.strawberryClones = strawberryClones;

    if (objects.corn?.[0]) dropZonesMap.corn.push(objects.corn[0]);       // corn1
    if (objects.tomato?.[0]) dropZonesMap.tomato.push(objects.tomato[0]); // tomato1

    return objects;
}
