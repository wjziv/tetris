'use strict';

import { config } from "./config.js";


class Sound {
    constructor(name) {
        this.filename = '../audio/' + name;
        this.audio = new Audio(this.filename)
        this.audio.volume = config.BASEVOLUME
    };
    play() {
        this.currentTime = 0;
        this.audio.play()
    };
    pause() {this.audio.pause()};
    mute(toggle) {this.audio.volume = toggle ? 0 : config.BASEVOLUME};
    loop() {
        this.play();
        this.audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        })
    };
    stop() {
        this.pause();
        this.audio.removeEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        })
    };
};


export const sound = {
    THEME: new Sound('korobeiniki.ogg'),
    // ROTATE_TETROMINO: new Sound('rotate_tetromino.ogg'),
    // MOVE_TETROMINO: new Sound('move_tetromino.ogg'),
    // LAND_TETROMINO: new Sound('land_tetromino.ogg'),
    // WALL_TETROMINO: new Sound('wall_tetromino.ogg'),
    // LOCK_TETROMINO: new Sound('lock_tetromino.ogg'),
    // GAME_OVER: new Sound('game_over.ogg'),
}


export function toggleMute() {
    if (sound.THEME.audio.volume) {
        sound.THEME.mute(true);
        muteEffects(true)
    } else {
        sound.THEME.mute(false);
        muteEffects(false)
    };
};


export function muteEffects(toggle) {
    // config.SOUNDS.LAND_TETROMINO.mute(toggle);
    // config.SOUNDS.LOCK_TETROMINO.mute(toggle);
    // config.SOUNDS.MOVE_TETROMINO.mute(toggle);
    // config.SOUNDS.WALL_TETROMINO.mute(toggle);
    // config.SOUNDS.ROTATE_TETROMINO.mute(toggle);
};
