'use strict';


export const direction = {
    LEFT: -1,
    RIGHT: 1,
};


export const color = {
    // Tetromino Colors
    CYAN: '#00ffff',
    BLUE: '#0000ff',
    ORANGE: '#ff7f00',
    YELLOW: '#ffff00',
    GREEN: '#00ff00',
    PURPLE: '#800080',
    RED: '#ff0000',

    // Utility Colors
    GREY: '#555555',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
};


export const config = {
    // Visual
    MINOPIXELS: 30,

    // Audio
    BASEVOLUME: 0.1,

    // Gameplay
    LOCKDELAY: 500,  // ms
    GRIDWIDTH: 10,  // unitless mino count
    GRIDHEIGHT: 20,  // unitless mino count
    STARTPOS: {
        x: 3,
        y: 1,

        copy() {
            return JSON.parse(JSON.stringify(this));
        },

        adjust(shapeName) {
            // The defined shape for "O" has too much buffer.
            // We need to adjust for it.
            let posCopy = this.copy();
            if (shapeName === "O") {
                posCopy.y -= 1;
            }
            return posCopy
        },
    },
};
