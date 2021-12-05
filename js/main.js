'use strict';

import { canvas } from "./canvas.js"
import { config } from "./config.js"
import { userInput } from "./controls.js"
import { Player } from "./player.js"
import { collision, landed, calcDelay } from "./utilities.js"
import { sound } from "./audio.js";
import { toggleMute } from "./audio.js";


export let player = new Player()


function stepGame(drop) {
    if (!player.active)  {
        return
    } else if (collision(player)) {
        // The only way to get here is if a tetromino was illegally placed by the system.
        // This should only happen at spawn if the tower grows too high.
        return endGame();
    } else if (landed(player)) {
        if ((Date.now() - player.lastMoveTime) >= config.LOCKDELAY) {
            player.lockTetromino();
            player.sweepBoard();
            player.reset();
            player.logMove();
            canvas.drawTetromino(player);
            return stepGame();
        } else {
            // Check X times per Delay unit.
            return setTimeout(stepGame, Math.floor(config.LOCKDELAY / 5));
        };
    } else {
        if (drop) {
            // Issues with current loc or next loc are handed in `stepGame`.
            // Getting here means we are clear to drop one cell downward.
            player.board.loc.y++;
            player.logMove();
            canvas.moveTetromino(player);
            return stepGame();
        } else {
            let timeDelay = calcDelay(player.scoring.level);
            return setTimeout(stepGame, (timeDelay * 1000), true);
        };
    };
};


function endGame() {
    sound.THEME.stop();
    tintScreen(0.7);
    document.removeEventListener("keydown", userInput, event);
    console.log('## LOSER.');
};


function hardReset() {
    player.reset(true);
    // Visual + Virtual gameboard reset.
};


let lastToggled = null;
export function playPause() {
    if (lastToggled) {
        // Control how quickly the game can be pause/unpaused.
        // Lack of control may cause duplicative downward forces.
        if (Date.now() - lastToggled < 500) {return};
    };
    lastToggled = Date.now();
    if (player.active) {
        // Pause logic
        tintScreen(0.4);
        document.removeEventListener("keydown", userInput, event);
        document.addEventListener("keydown", playPause);
        player.active = false;
        sound.THEME.stop();
    } else {
        // Resume logic
        tintScreen(0);
        player.active = true;
        canvas.drawTetromino(player);
        document.removeEventListener("keydown", playPause);
        document.addEventListener("keydown", userInput, event);
        sound.THEME.loop();
        stepGame();
    };
};


function tintScreen(opacity) {
    document.getElementById("cover").style.opacity = opacity;
};


function main() {
    canvas.drawGrid();
    document.getElementById("tetris").addEventListener("click", playPause);
};


document.getElementById("mute-music").addEventListener("click", toggleMute);
main();
