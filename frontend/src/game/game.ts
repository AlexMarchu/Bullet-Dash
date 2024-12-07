import Phaser from "phaser";

export default class Game extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyW!: Phaser.Input.Keyboard.Key;

    constructor() {
        super("Game");
    }

    preload() {
        // Загрузка ресурсов
    }

    create() {
        // Создание объектов игры
        this.add.text(100, 100, "Hello Phaser", { color: "#ffffff" });

        this.player = this.physics.add.sprite(400, 300, "").setOrigin(0.5, 0.5);
        this.player.setSize(50, 50);
        this.player.setDisplaySize(50, 50);
        this.player.setTint(0xfffafa);

        this.player.setCollideWorldBounds(true);

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();

            this.keyA = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            );
            this.keyS = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.S
            );
            this.keyD = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            );
            this.keyW = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.W
            );
        }
    }

    update() {
        const speed = 200;

        if (this.keyW.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.keyS.isDown) {
            this.player.setVelocityY(speed);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.keyA.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }
    }
}
