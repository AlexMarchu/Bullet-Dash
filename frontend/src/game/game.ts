import Phaser from "phaser";

export default class Game extends Phaser.Scene {
    
    private player!: Phaser.Physics.Arcade.Sprite;
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private spawnTime!: number;
    private blinkTime!: number;
    private isBlinking: boolean = true;
    private speed: number = 6;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('player', require('@/assets/player.png'));
    }

    create() {
        this.player = this.physics.add.sprite(400, 300, "player").setOrigin(0.5, 0.5);
        this.player.setSize(50, 50);
        this.player.setDisplaySize(50, 50);
        this.player.setTint(0xfffafa);
        this.player.setCollideWorldBounds(true);

        this.spawnTime = this.time.now;
        this.blinkTime = this.time.now;

        if (this.input.keyboard) {
            this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        }
    }

    update() {
        if (this.time.now - this.spawnTime < 2000) {
            if (this.time.now - this.blinkTime >= 100) {
                this.blinkTime = this.time.now;
                this.isBlinking = !this.isBlinking;
                this.player.setAlpha(this.isBlinking ? 1 : 0.4);
            }
        } else {
            this.player.setAlpha(1);
        }

        this.movePlayer();
    }

    private movePlayer(): void {

        if (this.keyA.isDown) {
            if (this.player.x > 0) this.player.x -= this.speed;
        }

        if (this.keyD.isDown) {
            if (this.player.x < Number(this.sys.game.config.width) - this.player.width) this.player.x += this.speed;
        }

        if (this.keyW.isDown) {
            if (this.player.y > 0) this.player.y -= this.speed;
        }

        if (this.keyS.isDown) {
            if (this.player.y < Number(this.sys.game.config.height) - this.player.height) this.player.y += this.speed;
        }
    }
}
