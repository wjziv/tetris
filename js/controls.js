'use strict';

import { config, direction } from "./config.js";
import { playPause, player } from "./main.js";
import { BreakException, collision } from "./utilities.js";
import { canvas } from "./canvas.js";


export const userInput = (event) => {
    let moveSuccess = false;
    const keyPress = {
        // Custom WASD Controls
        "KeyQ": tetrominoHold(),
        "KeyW": tetrominoHardDrop(),
        "KeyE": tetrominoRotate(direction.LEFT),
        "KeyA": tetrominoShift(direction.LEFT),
        "KeyS": tetrominoSoftDrop(),
        "KeyD": tetrominoShift(direction.RIGHT),
        "KeyR": tetrominoRotate(direction.RIGHT),

        // Classic Controls
        "ArrowUp": tetrominoRotate(direction.RIGHT),
        "KeyX": tetrominoRotate(direction.RIGHT),
        "Space": tetrominoHardDrop(),
        "ShiftRight": tetrominoHold(),
        "ShiftLeft": tetrominoHold(),
        "KeyC": tetrominoHold(),
        "ControlRight": tetrominoRotate(direction.LEFT),
        "ControlLeft": tetrominoRotate(direction.LEFT),
        "KeyZ": tetrominoRotate(direction.LEFT),
        "Escape": togglePauseGame(),
        "F1": togglePauseGame(),
        "ArrowRight": tetrominoShift(direction.RIGHT),
        "ArrowLeft": tetrominoShift(direction.LEFT),
        "ArrowDown": tetrominoSoftDrop(),
        "Numpad0": tetrominoHold(),
        "Numpad8": tetrominoHardDrop(),
        "Numpad4": tetrominoShift(direction.LEFT),
        "Numpad6": tetrominoShift(direction.RIGHT),
        "Numpad2": tetrominoSoftDrop(),
        "Numpad1": tetrominoRotate(direction.RIGHT),
        "Numpad5": tetrominoRotate(direction.RIGHT),
        "Numpad9": tetrominoRotate(direction.RIGHT),
        "Numpad3": tetrominoRotate(direction.LEFT),
        "Numpad7": tetrominoRotate(direction.LEFT),
    };

    function tetrominoShift(direction) {
        function execute(player) {
            let playerCopy = player.copy()
            playerCopy.board.loc.x += direction;
            if (!collision(playerCopy)) {
                player.board.loc.x += direction;
                moveSuccess = true;
            };
        };
        return execute
    };
    function tetrominoSoftDrop() {
        function execute(player) {
            let playerCopy = player.copy()
            playerCopy.board.loc.y++;
            if (!collision(playerCopy)) {
                player.board.loc.y++;
                moveSuccess = true;
                player.scoring.addDrop(1, false)
            };
        };
        return execute
    };
    function tetrominoHardDrop() {
        function execute(player) {
            let playerCopy = player.copy()
            while (true) {
                playerCopy.board.loc.y++;
                if (collision(playerCopy)) {
                    playerCopy.board.loc.y--;
                    break;
                };
            };
            if (playerCopy.board.loc.y === player.board.loc.y) {
                moveSuccess = false;
            } else {
                moveSuccess = true;
                player.scoring.addDrop((playerCopy.board.loc.y - player.board.loc.y), true)
            };

            player.board.loc.y = (playerCopy.board.loc.y);
        };
        return execute
    };
    function tetrominoRotate(direction) {
        function execute(player) {
            let playerCopy = player.copy()
            playerCopy.tetromino.now.rotate(direction);

            try {
                playerCopy.tetromino.now.kicks.forEach((kick) => {
                    let playerRotateCopy = playerCopy.copy();
                    playerRotateCopy.tetromino.now = playerCopy.tetromino.now;
                    playerRotateCopy.board.loc.x += kick.x;
                    playerRotateCopy.board.loc.y += kick.y;

                    if (collision(playerRotateCopy)) {
                    } else {
                        player.tetromino.now.rotate(direction);
                        player.board.loc.x += kick.x
                        player.board.loc.y += kick.y
                        moveSuccess = true;
                        throw BreakException
                    };
                });
                // No kicks worked! No rotation takes place.
                moveSuccess = false;
            } catch (err) {
                if (err === BreakException) {
                    return
                } else {
                    throw err
                };
            };
        };
        return execute
    };
    function tetrominoHold() {
        function execute(player) {
            if (player.tetromino.held) {return}
            if (player.tetromino.hold) {
                let currentTetromino = player.tetromino.now.copy();
                player.tetromino.now = player.tetromino.hold.copy();
                player.tetromino.hold = currentTetromino;
                player.tetromino.hold.rotation = 0;
                player.board.loc = config.STARTPOS.adjust(player.tetromino.now.name);
            } else {
                player.tetromino.hold = player.tetromino.now;
                player.tetromino.hold.rotation = 0;
                player.board.loc = config.STARTPOS.adjust(player.tetromino.now.name);
                player.tetromino.now = player.tetromino.queue.shift();
            };
            player.tetromino.held = true;
            moveSuccess = true;
        }
        return execute
    };
    function togglePauseGame() {
        function execute(player) {
            playPause()
        };
        return execute
    };

    // Try to enact the keystricken work.
    // Immediately undraw/redraw piece if possible.
    // Validation is performed within the action, prior to drawing.
    // If invalid key, ignore.
    moveSuccess = false;
    try {
        const action = keyPress[event.code];
        action(player);
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw e
        };
        return
    };

    if (moveSuccess) {
        player.logMove();
        canvas.moveTetromino(player);
    };
};
