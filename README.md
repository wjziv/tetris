# Tetris
Unofficially created by a major fan looking for a simple web-based solution with a few more bells/whistles I couldn't find in iterations of the game made by other enthusiasts.

Game-design is closely adherent to the Tetris Guidelines specified on the [Tetris Wiki](https://tetris.wiki/).

This is still absolutely a WIP.

## Gameplay
Find the game hosted [here](https://tetris.wjziv.com)!

Controls are consistent with those defined on the [Wiki](https://tetris.wiki/Tetris_Guideline#:~:text=to%20disable%20it.-,Controller%20mappings,-Standard%20mappings%20for).

## Underlying Principles
This project is written with two boards in play:
- The visual canvas element found on-screen.
- A virtual, nested array full of cell occupation information.

Every move made by the player is simulated on the virtual board to check for collisions.
If a corrective `kick` is elligible to put a colliding tetromino into play, it is applied.

If no kicks lead to valid placement, the move does not take place.
Else, the position is officially reflected by the `Player` object, and the update is then reflected on the visual canvas.

This may not be the most efficient practice, but it makes for a reasonably simple and maintainable codebase.

## Self Hosting
This is a basic HTML/CSS/JS application.
You can host it on just about any machine you have laying around.

### Simple
Clone this repo and open the [`index.html`](./index.html) file in your browser.

### Docker
A basic Dockerfile is supplied for hosting purposes.
Clone this repository to your server and get it off the ground with `docker build -d`.

## Reference
Style and operation choices were based off those on the Tetris Wiki.

- [General Guidelines](https://tetris.wiki/Tetris_Guideline)
- [Rotational Rules](https://tetris.wiki/Super_Rotation_System)

# TODO:
- [ ] Properly loop Tetris Theme.
- [ ] Include clearer "Game Over" screen.
- [ ] Include more sound effects.
- [ ] Show "Next" and "Hold"
- [ ] Present Controls.
- [ ] Implement T-Spin Scoring.
- [ ] Connect to docker registries.
- [ ] Unraid support.