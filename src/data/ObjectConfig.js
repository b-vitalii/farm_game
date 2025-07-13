export const animalConfigs = {
    cow: {
        base: {
            name: 'cow_1',
            animation: 'idle_cow',
            position: [11, 4.2, 3],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        },
        clones: [
            {
                position: [10, 4.2, 6],
                rotation: [0, -2, 0],
            },
            {
                position: [11, 4.2, 0],
                rotation: [0, 2, 0],
            }
        ]
    },
    sheep: {
        base: {
            name: 'sheep_1',
            animation: 'idle_sheep',
            position: [10.8, 4.2, -7.5],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        },
        clones: [
            {
                animation: 'action_sheep',
                position: [12.4, 4.2, -8.7],
                rotation: [0, 3.1, 0],
            },
            {
                animation: 'action_sheep',
                position: [9.4, 4.2, -8.7],
                rotation: [0, 3.1, 0],
            },
            {
                animation: 'idle_sheep',
                position: [9.4, 4.2, -6],
                rotation: [0, -1, 0],
            }
        ]
    },
    chicken: {
        base: {
            name: 'chicken_1',
            animation: 'idle_chicken',
            position: [3, 4, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        },
        clones: [
            { animation: 'action_chicken', position: [4, 4, 0], rotation: [0, 1, 0] },
            { animation: 'action_chicken', position: [3, 4, 1], rotation: [0, 2, 0] },
            { animation: 'idle_chicken',   position: [5, 4, -1], rotation: [0, -1, 0] },
            { animation: 'action_chicken', position: [2, 4, 0], rotation: [0, -1, 0] },
            { animation: 'action_chicken', position: [2, 4, 2], rotation: [0, -1, 0] },
            { animation: 'idle_chicken',   position: [3, 4, -2], rotation: [0, -2, 0] },
            { animation: 'action_chicken', position: [4, 4, 3], rotation: [0, 1, 0] },
            { animation: 'action_chicken', position: [1, 4, 3], rotation: [0, 1, 0] },
            { animation: 'action_chicken', position: [4, 4, -3], rotation: [0, 1, 0] },
            { animation: 'action_chicken', position: [2, 4, -3], rotation: [0, 1, 0] },
            { animation: 'action_chicken', position: [1, 4, -2], rotation: [0, -1, 0] },
            { animation: 'action_chicken', position: [1, 4, 4], rotation: [0, 2, 0] },
            { animation: 'idle_chicken',   position: [5, 4, 4], rotation: [0, 2, 0] },
            { animation: 'idle_chicken',   position: [5, 4, 3], rotation: [0, -2, 0] },
        ]
    }
};


export const plantConfig = {
    fence: {
        scale: [1, 1, 1],
        position: [10.8, 4.2, 3],
    },
    ground: {
        scale: [1.7, 1, 1.7],
        position: [-10.3, 4.6, 0],
    },
    strawberry: [
        { name: 'strawberry_1', position: [-7.7, 4.6, 0.4] },
        { name: 'strawberry_2', position: [-7, 4.5, -1] },
        { name: 'strawberry_3', position: [-8, 4.6, 0] },
    ],
    corn: [
        { name: 'corn_1', position: [-8, 4.4, 5.5] },
        { name: 'corn_2', position: [-8.5, 4.4, 6] },
        { name: 'corn_3', position: [-7, 4.4, 7] },
    ],
    tomato: [
        { name: 'tomato_1', position: [-13.5, 4.5, 5.7] },
        { name: 'tomato_2', position: [-12, 4.5, 6] },
        { name: 'tomato_3', position: [-13, 4.5, 7] },
    ],
    grape: [
        { name: 'grape_1', position: [-13.5, 4.5, -0.6] },
        { name: 'grape_2', position: [-14, 4.5, -0.6] },
        { name: 'grape_3', position: [-13, 4.5, 1.1] },
    ],
    grapeClones: [
        { name: 'grape_3', position: [-12.2, 4.5, -6.3] },
        { name: 'grape_3', position: [-14.2, 4.5, -7.7] },
        { name: 'grape_3', position: [-12.2, 4.5, -4.3] },
        { name: 'grape_3', position: [-14.2, 4.5, -4.3] },
    ],
    strawberryClones: [
        { name: 'strawberry_2', position: [-8, 4.5, -1] },
        { name: 'strawberry_2', position: [-8.3, 4.5, 0] },
        { name: 'strawberry_3', position: [-7.2, 4.5, -6.3] },
        { name: 'strawberry_3', position: [-8.2, 4.5, -6.3] },
        { name: 'strawberry_3', position: [-8.2, 4.5, -6.1] },
        { name: 'strawberry_3', position: [-8.2, 4.5, -5.1] },
    ],
};

