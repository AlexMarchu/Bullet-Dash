import Phaser from "phaser";
import Player from "./modules/player";

export default class Game extends Phaser.Scene {
    private player!: Player;
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("player", "game/assets/images/player.png")
    }

    create() {
        this.player = new Player(this, this.game.config.width as number / 2, this.game.config.height as number / 2, "player");
    }

    update() {
        this.player.update();
    }
}
