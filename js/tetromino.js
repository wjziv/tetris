'use strict';

import { color } from "./config.js";
import { rotateMatrix } from "./utilities.js";


const I = "I";
const O = "O";
const T = "T";
const S = "S";
const Z = "Z";
const J = "J";
const L = "L";
const _ = null;

export const tetrominoDef = {
    I: {
        name: I,
        color: color.CYAN,
        shape: [
            [_,_,_,_],
            [I,I,I,I],
            [_,_,_,_],
            [_,_,_,_],
        ],
    },
    O: {
        name: O,
        color: color.YELLOW,
        shape: [
            [_,_,_,_],
            [_,O,O,_],
            [_,O,O,_],
            [_,_,_,_],
        ],
    },
    T: {
        name: T,
        color: color.PURPLE,
        shape: [
            [_,T,_],
            [T,T,T],
            [_,_,_],
        ],
    },
    S: {
        name: S,
        color: color.GREEN,
        shape: [
            [_,S,S],
            [S,S,_],
            [_,_,_],
        ],
    },
    Z: {
        name: Z,
        color: color.RED,
        shape: [
            [Z,Z,_],
            [_,Z,Z],
            [_,_,_],
        ],
    },
    J: {
        name: J,
        color: color.BLUE,
        shape: [
            [J,_,_],
            [J,J,J],
            [_,_,_],
        ],
    },
    L: {
        name: L,
        color: color.ORANGE,
        shape: [
            [_,_,L],
            [L,L,L],
            [_,_,_],
        ],
    },
};


export class Tetromino {
    /*
        The Tetromino piece!
        Functionality is limited to manipulation of the piece itself.
        The Tetromino is wary of its own type, orientation, and qualia inferred by these traits.
        It does not do any validation against the board in any way.

        A Tetromino on its own should not come with any rules regarding placement.
        The only rules defined within a Tetromino should be against its shape and rotation.
    */
    constructor(minoIdentity) {
        let tetromino = tetrominoDef[minoIdentity]
        this.name = tetromino.name;
        this.color = tetromino.color;
        this.shape = tetromino.shape;
        this.rotation = 0;
        this.kicks = [];
    };

    copy() {
        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            JSON.parse(JSON.stringify(this)),
        );
    };

    rotate(direction) {
        // Capture the kicks associated with the change in rotation.
        this.kicks = this.getKicks(
            this.rotation,
            this.incrementRotation(direction)
        );
        this.shape = rotateMatrix(this.shape, direction);
    };

    incrementRotation(direction) {
        this.rotation = ((this.rotation + 4) + direction) % 4;
        return this.rotation
    };

    getKicks(rotA, rotB) {
        // "Kicks" are loc displacements used by the player board.matrix to correct placement
        // of a Tetromino should it interfere with existing pieces or walls upon rotation.
        // There are separate kicks defined by Tetromino type and rotation direction.
        if (this.name === I) {
            switch (rotA, rotB) {
                case (0, 1):
                    return [
                        {x: 0, y: 0},
                        {x: -2, y: 0},
                        {x: 1, y: 0},
                        {x: -2, y: 1},
                        {x: 1, y: -2},
                    ]
                case (1, 0):
                    return [
                        {x: 0, y: 0},
                        {x: 2, y: 0},
                        {x: -1, y: 0},
                        {x: 2, y: -1},
                        {x: -1, y: 2},
                    ]
                case (1, 2):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: 2, y: 0},
                        {x: -1, y: -2},
                        {x: 2, y: 1},
                    ]
                case (2, 1):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: -2, y: 0},
                        {x: 1, y: 2},
                        {x: -2, y: -1},
                    ]
                case (2, 3):
                    return [
                        {x: 0, y: 0},
                        {x: 2, y: 0},
                        {x: -1, y: 0},
                        {x: 2, y: -1},
                        {x: -1, y: 2},
                    ]
                case (3, 2):
                    return [
                        {x: 0, y: 0},
                        {x: -2, y: 0},
                        {x: 1, y: 0},
                        {x: -2, y: 1},
                        {x: 1, y: -2},
                    ]
                case (3, 0):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: -2, y: 0},
                        {x: 1, y: 2},
                        {x: -2, y: -1},
                    ]
                case (0, 3):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: 2, y: 0},
                        {x: -1, y: -2},
                        {x: 2, y: 1},
                    ]
                default:
                    throw "Invalid rotation pair.";
            };
        } else {
            switch (rotA, rotB) {
                case (0, 1):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: -1, y: -1},
                        {x: 0, y: 2},
                        {x: -1, y: 2},
                    ]
                case (1, 0):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 0, y: -2},
                        {x: 1, y: -2},
                    ]
                case (1, 2):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 0, y: -2},
                        {x: 1, y: -2},
                    ]
                case (2, 1):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: -1, y: -1},
                        {x: 0, y: 2},
                        {x: -1, y: 2},
                    ]
                case (2, 3):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: 1, y: -1},
                        {x: 0, y: 2},
                        {x: -1, y: 2},
                    ]
                case (3, 2):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: -1, y: 1},
                        {x: 0, y: -2},
                        {x: -1, y: -2},
                    ]
                case (3, 0):
                    return [
                        {x: 0, y: 0},
                        {x: -1, y: 0},
                        {x: -1, y: 1},
                        {x: 0, y: -2},
                        {x: -1, y: -2},
                    ]
                case (0, 3):
                    return [
                        {x: 0, y: 0},
                        {x: 1, y: 0},
                        {x: 1, y: -1},
                        {x: 0, y: 2},
                        {x: -1, y: 2},
                    ]
                default:
                    throw "Invalid rotation pair.";
            };
        };
    };
};

export const tetrominos = [
    new Tetromino(I),
    new Tetromino(O),
    new Tetromino(T),
    new Tetromino(J),
    new Tetromino(L),
    new Tetromino(S),
    new Tetromino(Z),
];
