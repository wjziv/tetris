'use strict';

import { config, direction } from "./config.js";


export var BreakException = {};


export function calcDelay(lvl) {
    return (0.8 - ((lvl - 1) * 0.007)) ** (lvl - 1);
};


export function buildMatrix(width, height, fill) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(fill));
    };
    return matrix;
};


export function shuffleArray(array) {

    function shuffleFisherYates(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    };

    let newArray = [];
    shuffleFisherYates(Array.from(Array(array.length).keys())).forEach(randomIndex => {
        newArray.push(array[randomIndex]);
    });
    return newArray;
};


export function rotateMatrix(matrix, dir) {
    /*
        Rotate a 2d matrix, retaining nested dimensions.
        Example:
        [                       [
            [1, 2],                 [5, 3, 1],   
            [3, 4],  =(+dir)=>      [6, 4, 2]
            [5, 6]              ]
        ]
    */

    // [], [[1]] are both their own rotations.
    if (matrix.length < 1) {return matrix};
    if (matrix[0].length < 2) {return matrix};

    let newMatrix = [];
    // Loop through existing dimensions. Swap usage.
    for (let x = 0; x < matrix[0].length; x++) {
        let newRow = [];
        for (let y = 0; y < matrix.length; y++) {
            if (dir == direction.RIGHT) {
                newRow.unshift(matrix[y][x]);
            } else if (dir == direction.LEFT) {
                newRow.push(matrix[y][x]);
            };
        };

        if (dir == direction.RIGHT) {
            newMatrix.push(newRow);
        } else if (dir == direction.LEFT) {
            newMatrix.unshift(newRow);
        };
    };
    return newMatrix;
};


export function relativeLoc(loc, shape) {
    let locArray = [];

    shape.forEach((row, i) => {
        row.forEach((element, j) => {
            locArray.push({
                x: loc.x  + j,
                y: loc.y + i,
                value: element,
            });
        });
    });

    return locArray;
};


export function collision(player) {
    try {
        relativeLoc(player.board.loc, player.tetromino.now.shape).forEach(element => {
            if (!element.value) {return};  // 0 mino doesn't matter.
            if ((element.x < 0) || (element.x > (config.GRIDWIDTH - 1))) {throw BreakException};
            if ((element.y < 0) || (element.y > (config.GRIDHEIGHT - 1))) {throw BreakException};
            if (player.board.matrix[element.y][element.x]) {throw BreakException};
        });
    } catch (err) {
        if (err == BreakException) {
            return true;
        } else {
            throw err;
        };
    };
    return false
};


export function landed(player) {
    // Check  if collision when moving y - 1.
    let playerCopy = player.copy();
    playerCopy.board.loc.y++;
    return collision(playerCopy);
};
