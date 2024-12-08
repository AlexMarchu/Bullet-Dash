import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 6;
    private spawnTime: number;
    private blinkTime: number;
    private isBlinking: boolean = true;
    private score: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene = scene;

        this.scene.physics.world.enable(this);

        this.spawnTime = this.scene.time.now;
        this.blinkTime = this.scene.time.now;

        this.setOrigin(0.5, 0.5);

        this.x = x;
        this.y = y;

        this.scene.add.existing(this);
    }

    update(): void {
        if (this.scene.time.now - this.spawnTime < 1500) {
            if (this.scene.time.now - this.blinkTime >= 100) {
                this.blinkTime = this.scene.time.now;
                this.isBlinking = !this.isBlinking;
                this.setAlpha(this.isBlinking ? 1 : 0.4);
            }
        } else {
            this.setAlpha(1);
        }

        this.move();
    }

    move(): void {

        const cursors = this.scene.input.keyboard!.createCursorKeys();

        if (cursors.left.isDown && this.x > 0) {
            this.x -= this.speed;
        }

        if (cursors.right.isDown && this.x < (this.scene.sys.game.config.width as number) - this.width) {
            this.x += this.speed;
        }


        if (cursors.up.isDown && this.y > 0) {
            this.y -= this.speed;
        }

        if (cursors.down.isDown && this.y < (this.scene.sys.game.config.height as number) - this.height) {
            this.y += this.speed;
        }
    }
}
