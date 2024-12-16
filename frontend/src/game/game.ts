import Phaser from "phaser";

export class Attacks {
    private scene: Phaser.Scene;
    private attackTimer: number = 0;
    private shootCooldown: number = 0;
    private currentPattern: number = 0;
    private nextPattern: number = Phaser.Math.Between(0, 2);
    private hardMode: boolean = false;
    private hardModeTimer: number = 0;
    private extraAttacks: number = 0;
    private offset: number = 0;
    private rotateDir: number = 0;
    private projectiles: Projectile[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public update(player: Phaser.Physics.Arcade.Sprite, screenSize: { width: number; height: number }) {
        const hardTime = 30;

        if (this.scene.time.now - this.attackTimer > 2000) {
            this.attackTimer = this.scene.time.now;
            this.currentPattern = this.nextPattern;
            this.nextPattern = Phaser.Math.Between(0, 2);

            if (!this.hardMode && Phaser.Math.Between(0, 5) === 0) {
                this.hardMode = true;
                this.hardModeTimer = this.scene.time.now;
                if (player.body instanceof Phaser.Physics.Arcade.Body) {
                    this.extraAttacks = Math.floor(player.body.speed / 20);
                }
            }
        }

        if (this.hardMode && this.scene.time.now - this.hardModeTimer > hardTime * 1000) {
            this.hardMode = false;
            this.extraAttacks = 0;
        }

        switch (this.currentPattern) {
            case 0:
                this.radialAttack(screenSize);
                break;
            case 1:
                this.arrowAttack(screenSize);
                break;
            case 2:
                this.edgeAttack(screenSize);
                break;
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(screenSize);

            if (projectile.offScreen(screenSize)) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    private radialAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 250) {
            for (let i = 0; i < 12 + this.extraAttacks; i++) {
                const angle = Phaser.Math.DegToRad((360 / (12 + this.extraAttacks)) * i + this.offset);
                const x = screenSize.width / 2;
                const y = screenSize.height / 2;
                const endX = x + Math.cos(angle) * 100;
                const endY = y + Math.sin(angle) * 100;

                this.projectiles.push(new Projectile(this.scene, x, y, "fireball", new Phaser.Math.Vector2(endX, endY), 10));
            }
            this.offset += 10;
            this.shootCooldown = this.scene.time.now;
        }
    }

    private arrowAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 500) {
            const direction = Phaser.Math.Between(0, 3);
            for (let i = 0; i < Phaser.Math.Between(2, 5 + this.extraAttacks); i++) {
                let x = 0, y = 0, endX = 0, endY = 0;
                if (direction === 0) {
                    x = Phaser.Math.Between(0, screenSize.width);
                    y = 0;
                    endX = x;
                    endY = 100;
                } else if (direction === 1) {
                    x = Phaser.Math.Between(0, screenSize.width);
                    y = screenSize.height;
                    endX = x;
                    endY = screenSize.height - 100;
                } else if (direction === 2) {
                    x = 0;
                    y = Phaser.Math.Between(0, screenSize.height);
                    endX = 100;
                    endY = y;
                } else {
                    x = screenSize.width;
                    y = Phaser.Math.Between(0, screenSize.height);
                    endX = screenSize.width - 100;
                    endY = y;
                }

                this.projectiles.push(new Projectile(this.scene, x, y, "arrow", new Phaser.Math.Vector2(endX, endY), 15));
            }
            this.shootCooldown = this.scene.time.now;
        }
    }

    private edgeAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 500) {
            const edge = Phaser.Math.Between(0, 1);
            const centerX = screenSize.width / 2;
            const centerY = screenSize.height / 2;
    
            for (let i = 0; i < 8; i++) {
                const angle = Phaser.Math.DegToRad((360 / 8) * i);
                const radius = 1;
                const startX = centerX + Math.cos(angle) * radius;
                const startY = centerY + Math.sin(angle) * radius;
    
                const endX = startX + Math.cos(angle) * 200;
                const endY = startY + Math.sin(angle) * 200;
    
                this.projectiles.push(new Projectile(this.scene, startX, startY, "fireball", new Phaser.Math.Vector2(endX, endY), 10));
            }
            this.shootCooldown = this.scene.time.now;
        }
    }
}

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
        offscreenDisable: boolean = false
    ) {
        this.x = x;
        this.y = y;
        this.obsType = obsType;
        this.speed = speed / 3;
        this.size = size;
        this.offscreenDisable = offscreenDisable;

        this.img = scene.add.image(x, y, obsType).setScale(size);
        this.startVector = new Phaser.Math.Vector2(x, y);
        this.endVector = endLoc;

        this.rotation = Math.atan2(endLoc.y - y, endLoc.x - x);
        this.img.setRotation(this.rotation);
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
        return (
            this.x < -this.img.displayWidth ||
            this.x > screenSize.width ||
            this.y < -this.img.displayHeight ||
            this.y > screenSize.height
        );
    }

    update(screenSize: { width: number; height: number }): void {
        this.move();
        if (this.offScreen(screenSize)) {
            this.destroy();
        }
    }

    destroy(): void {
        if (this.img) {
            this.img.destroy();
        }
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
    private playerSpeed: number = 4;
    private attacks!: Attacks;
    private timeElapsed: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    getScore() {
        return Math.floor(this.timeElapsed / 30);
    }

    preload() {
        this.load.image('player', require('@/assets/player.png'));
        this.load.image('fireball', require('@/assets/fireball.png'));
        this.load.image('arrow', require('@/assets/arrow.png'));
    }

    create() {
        const screenWidth = this.sys.canvas.width;
        const screenHeight = this.sys.canvas.height;

        this.player = this.physics.add.sprite(screenWidth / 2, screenHeight / 2, "player").setOrigin(0.5, 0.5);
        this.player.setDisplaySize(35, 35);
        this.screenSize = { width: this.sys.canvas.width, height: this.sys.canvas.height };

        this.projectiles = this.physics.add.group();

        this.attacks = new Attacks(this);

        this.scoreText = this.add.text(
            screenWidth / 2,
            screenHeight / 2,
            '0',
            { font: '96px Pixeboy', color: '#ffffff' }
        ).setOrigin(0.5, 0.6);
        this.scoreText.setDepth(1);

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

    update(time: number, delta: number) {
        this.movePlayer();

        this.attacks.update(this.player, this.screenSize);

        this.projectiles.getChildren().forEach((projectile: Phaser.GameObjects.GameObject) => {
            if (projectile instanceof Phaser.Physics.Arcade.Image) {
                const proj = projectile as any;
                proj.move();

                if (proj.offScreen(this.screenSize)) {
                    this.projectiles.remove(projectile, true, true);
                }
            }
        });
        
        this.timeElapsed++;
        this.scoreText.text = `${this.getScore()}`;
    }

    private movePlayer(): void {
        if (this.keyA.isDown && this.player.x > 0) {
            this.player.x -= this.playerSpeed;
        }

        if (this.keyD.isDown && this.player.x < this.screenSize.width - this.player.width) {
            this.player.x += this.playerSpeed;
        }

        if (this.keyW.isDown && this.player.y > 0) {
            this.player.y -= this.playerSpeed;
        }

        if (this.keyS.isDown && this.player.y < this.screenSize.height - this.player.height) {
            this.player.y += this.playerSpeed;
        }
    }


    private handleCollision(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, projectile: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        if (projectile instanceof Phaser.Physics.Arcade.Image) {
            projectile.destroy();

            console.log("Collision detected!");
        }
    }

    private addProjectile(x: number, y: number, type: string, target: Phaser.Math.Vector2, speed: number) {
        const projectile = new Projectile(this, x, y, type, target, speed);
        this.projectiles.add(projectile.img);
    }
}