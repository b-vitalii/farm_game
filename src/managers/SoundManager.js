import { Howl, Howler } from 'howler';

export const music = new Howl({
    src: ['/sounds/theme.mp3'],
    loop: true,
    volume: 0.5,
});

export const clickSound = new Howl({
    src: ['/sounds/click_003.mp3'],
    loop: false,
    volume: 1,
});

export const popupChestSound = new Howl({
    src: ['/sounds/popup_chest.mp3'],
    loop: false,
    volume: 1,
});

export const chickenSound = new Howl({
    src: ['/sounds/chicken.mp3'],
    loop: false,
    volume: 1,
});

export const sheepSound = new Howl({
    src: ['/sounds/sheep.mp3'],
    loop: false,
    volume: 1,
});

export const cowSound = new Howl({
    src: ['/sounds/cow.mp3'],
    loop: false,
    volume: 1,
});

export const throwSpearSound = new Howl({
    src: ['/sounds/throw_spear.mp3'],
    loop: false,
    volume: 1,
});

export function muteAll(isMuted) {
    Howler.mute(isMuted);
}
