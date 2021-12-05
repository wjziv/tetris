'use strict';

import { config } from "./config.js";
import { tetrominos, tetrominoDef } from "./tetromino.js";
import { buildMatrix, relativeLoc, shuffleArray } from "./utilities.js"
import { canvas } from "./canvas.js";

export class Player {

    constructor() {
        this.newRun = false;
        this.active = false;
        this.lastMoveTime = Date.now();
        this.scoring = this.startScoring();
        this.tetromino = this.startTetrominos();
        this.board = this.startBoard();
    };

    copy() {
        let copyPlayer = Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            JSON.parse(JSON.stringify(this)),
        );
        if (this.tetromino.now) {
            copyPlayer.tetromino.now = this.tetromino.now.copy()
        };
        if (this.tetromino.next) {
            copyPlayer.tetromino.next = this.tetromino.next.copy()
        };
        if (this.tetromino.hold) {
            copyPlayer.tetromino.hold = this.tetromino.hold.copy()
        };

        return copyPlayer
    };

    logMove() {
        this.lastMoveTime = Date.now()
    };

    startBoard() {
        return {
            loc: config.STARTPOS.adjust(this.tetromino.now.name),
            matrix: buildMatrix(config.GRIDWIDTH, config.GRIDHEIGHT),
        };
    };

    startScoring() {
        let scoringBase = {
            lines: 0,
            score: 0,
            level: 1,
            b2b: false,

            visual: {
                score: document.getElementById("score"),
                level: document.getElementById("level"),
                lines: document.getElementById("lines"),
            },

            addDrop(rows, hard) {
                this.score += (rows * (hard ? 2 : 1))
                this.visual.score.innerHTML = this.score;
            },

            addTspin(count, mini) {
                // TODO: Implement Properly.
                // Inspo: https://harddrop.com/wiki/T-Spin_Guide
                // Fake demo shown here.
                let netScore = (0 * count * (mini ? (1/2) : 1));
                this.score += (netScore * this.level * (this.b2b ? (3/2) : 1));
                this.visual.score.innerHTML = this.score;
            },

            addLines(rows) {
                this.lines += rows;

                if (rows < 4) {this.b2b = false;};

                let linesScore = {
                    0: 0,
                    1: 100,
                    2: 300,
                    3: 500,
                    4: 800,
                };

                this.score += (linesScore[rows] * this.level * (this.b2b ? (3/2) : 1));
                this.visual.score.innerHTML = this.score;
                this.visual.lines.innerHTML = this.lines;
                if (rows === 4) {this.b2b = true;};

                this.level = (Math.floor(this.lines / 10) + 1);
                this.visual.level.innerHTML = this.level;
            },

            initScoring() {
                this.visual.score.innerHTML = this.score;
                this.visual.level.innerHTML = this.level;
                this.visual.lines.innerHTML = this.lines;
            },

        };

        scoringBase.initScoring();
        return scoringBase;
    };

    startTetrominos() {
        let randomTetrominos = shuffleArray(tetrominos);
        return {
            now: randomTetrominos.shift(),
            next: randomTetrominos.shift(),
            queue: randomTetrominos,
            hold: null,
            held: false,
        };
    };

    lockTetromino() {
        relativeLoc(this.board.loc, this.tetromino.now.shape).forEach((element) => {
            if (!element.value) {return};  // null mino doesn't matter.

            if ((element.x < 0) || (element.x > config.GRIDWIDTH)) {return};
            if ((element.y < 0) || (element.y > config.GRIDHEIGHT)) {return};

            this.board.matrix[element.y][element.x] = element.value;
        });
    };

    sweepBoard() {
        this.scoring.addLines(this.board.matrix.filter(row => (row.filter(Boolean).length === row.length)).length);

        this.board.matrix.filter(row => (row.filter(Boolean).length === row.length)).forEach(x => {
            this.board.matrix.splice(this.board.matrix.indexOf(x), 1);
            this.board.matrix.unshift(new Array(config.GRIDWIDTH).fill(null));
        });

        this.board.matrix.forEach((row, y) => {
            canvas.resetRow(y);
            row.forEach((occupant, x) => {
                if (occupant) {
                    canvas.drawBlock(x, y, tetrominoDef[occupant].color);
                };
            });
        });

    };

    reset(toBeginning) {
        if (toBeginning) {
            this.scoring = this.startScoring();
            this.tetromino = this.startTetrominos();
            this.board = this.startBoard();
        } else {
            this.tetromino.held = false;
            this.tetromino.now = this.tetromino.next;
            this.tetromino.next = this.tetromino.queue.shift();
            this.board.loc = config.STARTPOS.adjust(this.tetromino.now.name);

            if (this.tetromino.queue.length < tetrominos.length) {
                this.tetromino.queue.push(...shuffleArray(tetrominos));
            };
        };
    };
};
