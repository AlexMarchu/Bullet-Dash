import Phaser from "phaser";

class Projectile {
    x: number;
    y: number;
    obsType: string;
    img: Phaser.GameObjects.Image;
    speed: number;
    startVector: Phaser.Math.Vector2;
    endVector: Phaser.Math.Vector2;
    rotation: number;
    size: number;
    offscreenDisable: boolean;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        obsType: string,
        endLoc: Phaser.Math.Vector2,
        speed: number,
        size: number = 1,
        offscreenDisable: boolean = false,
    ) {
        this.x = x;
        this.y = y;
        this.obsType = obsType;
        this.speed = speed;
        this.size = size;
        this.offscreenDisable = offscreenDisable;

        this.img = scene.add.image(x, y, obsType).setScale(size);
        this.startVector = new Phaser.Math.Vector2(x, y);
        this.endVector = endLoc;

        this.rotation = Phaser.Math.RadToDeg(Math.atan2(y - endLoc.y, endLoc.x - x));
        this.img.setRotation(Phaser.Math.DegToRad(this.rotation));

    }

    move(): void {
        const velocity = this.endVector
            .clone()
            .subtract(this.startVector)
            .normalize()
            .scale(this.speed);

        this.x += velocity.x;
        this.y += velocity.y;

        this.img.setPosition(this.x, this.y);
    }

    offScreen(screenSize: { width: number; height: number }): boolean {
        const isOffScreen =
            this.x < -this.img.displayWidth ||
            this.x > screenSize.width ||
            this.y < -this.img.displayHeight ||
            this.y > screenSize.height;

        if (isOffScreen && !this.offscreenDisable) {
            this.img.destroy();
        }

        return isOffScreen;
    }
}

export default class Game extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private projectiles!: Phaser.Physics.Arcade.Group;
    private screenSize!: { width: number; height: number };
    private speed: number = 2;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('player', require('@/assets/player.png'));
        this.load.image('fireball', require('@/assets/fireball.png'));
        this.load.image('arrow', require('@/assets/arrow.png'));
    }

    create() {
        this.player = this.physics.add.sprite(400, 300, "player").setOrigin(0.5, 0.5);
        this.player.setDisplaySize(50, 50);
        this.screenSize = {width: this.sys.canvas.width, height: this.sys.canvas.height};

        this.projectiles = this.physics.add.group();

        this.addProjectile(100, 100, "fireball", new Phaser.Math.Vector2(400, 300), 100);
        this.addProjectile(200, 200, "arrow", new Phaser.Math.Vector2(200, 300), 150);

        if (this.input.keyboard) {
            this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        }

        this.physics.add.collider(
            this.player as Phaser.Types.Physics.Arcade.GameObjectWithBody,
            this.projectiles as Phaser.Physics.Arcade.Group,
            (player, projectile) => this.handleCollision(player as Phaser.Types.Physics.Arcade.GameObjectWithBody, projectile as Phaser.Types.Physics.Arcade.GameObjectWithBody),
            undefined,
            this
        );


    }

    update() {
        this.movePlayer();
    }

    private addProjectile(
        x: number,
        y: number,
        type: string,
        endLoc: Phaser.Math.Vector2,
        speed: number
    ): void {
        const projectile = this.physics.add.image(x, y, type).setScale(1);
        const direction = new Phaser.Math.Vector2(endLoc.x - x, endLoc.y - y).normalize();
        projectile.setVelocity(direction.x * speed, direction.y * speed);

        this.projectiles.add(projectile);
    }

    private handleCollision(
        player: Phaser.GameObjects.GameObject,
        projectile: Phaser.GameObjects.GameObject
    ): void {
        const playerBody = player as Phaser.Types.Physics.Arcade.GameObjectWithBody;
        const projectileBody = projectile as Phaser.Types.Physics.Arcade.GameObjectWithBody;

        if (playerBody.body && projectileBody.body) {
            console.log("Collision detected!");


            const sprite = playerBody as Phaser.Physics.Arcade.Sprite;
            sprite.setTint(0xff0000);


        }
    }


    private movePlayer(): void {
        if (this.keyA.isDown && this.player.x > 0) {
            this.player.x -= this.speed;
        }

        if (this.keyD.isDown && this.player.x < this.screenSize.width - this.player.width) {
            this.player.x += this.speed;
        }

        if (this.keyW.isDown && this.player.y > 0) {
            this.player.y -= this.speed;
        }

        if (this.keyS.isDown && this.player.y < this.screenSize.height - this.player.height) {
            this.player.y += this.speed;
        }
    }
}

