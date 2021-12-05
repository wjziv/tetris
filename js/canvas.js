'use strict';

import { config } from "./config.js";
import { color } from "./config.js";
import { relativeLoc } from "./utilities.js";


const cnvs = document.getElementById("tetris");
const ctx = cnvs.getContext("2d");
const borderWidth = 1;


export let canvas = {
    canvas: cnvs,
    ctx: ctx,
    lastTetromino: null,
    lastLoc: null,

    drawBlock(x, y, c) {
        this.ctx.beginPath();
        this.ctx.moveTo((x * config.MINOPIXELS) + borderWidth, ((y) + 0.5) * config.MINOPIXELS);
        this.ctx.lineTo(((x + 1) * config.MINOPIXELS) - borderWidth, ((y) + 0.5) * config.MINOPIXELS);
        this.ctx.strokeStyle = c;
        this.ctx.lineWidth = config.MINOPIXELS - (borderWidth * 2);
        this.ctx.stroke();
    },
    resetRow(rowIndex) {
        for (let i = 0; i < config.GRIDWIDTH; i++) {
            this.drawBlock(i, rowIndex, color.GREY);
        };
    },
    drawTetromino(player) {

        relativeLoc(player.board.loc, player.tetromino.now.shape).forEach((element) => {
            if (element.value) {
                this.drawBlock(element.x, element.y, player.tetromino.now.color);
            };
        });

        this.lastLoc = JSON.parse(JSON.stringify(player.board.loc));
        this.lastTetromino = player.tetromino.now.copy();
    },
    undrawTetromino() {
        if (!(this.lastTetromino && this.lastLoc)) {return}
        
        relativeLoc(this.lastLoc, this.lastTetromino.shape).forEach((element) => {
            if (element.value) {
                this.drawBlock(element.x, element.y, color.GREY);
            };
        });
    },
    moveTetromino(player) {
        this.undrawTetromino();
        this.drawTetromino(player);
    },

    drawGrid() {
        this.ctx.beginPath();

        // Build Canvas Dimensions
        this.canvas.width = config.GRIDWIDTH * config.MINOPIXELS;
        this.canvas.height = config.GRIDHEIGHT * config.MINOPIXELS;

        // Fill Background
        this.ctx.fillStyle = color.GREY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid Lines
        for (var x = 0; x <= this.canvas.width; x += config.MINOPIXELS) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height + config.MINOPIXELS);
        };
        for (var y = 0; y <= this.canvas.height; y += config.MINOPIXELS) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width + config.MINOPIXELS, y);
        };

        this.ctx.strokeStyle = color.BLACK;
        this.ctx.lineWidth = borderWidth;
        this.ctx.stroke();
    },

};