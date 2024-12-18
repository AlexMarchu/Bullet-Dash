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
    private projectiles: Projectile[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public update(player: Phaser.Physics.Arcade.Sprite, screenSize: { width: number; height: number }) {
        const hardTime = 30;

        if (this.scene.time.now - this.attackTimer > 2000) {
            this.attackTimer = this.scene.time.now;
            this.currentPattern = this.nextPattern;
            this.nextPattern = Phaser.Math.Between(0, 4);

            // if (!this.hardMode && Phaser.Math.Between(0, 5) === 0) {
            //     this.hardMode = true;
            //     this.hardModeTimer = this.scene.time.now;
            //     if (player.body instanceof Phaser.Physics.Arcade.Body) {
            //         this.extraAttacks = Math.floor(player.body.speed / 20);
            //     }
            // }
            this.hardMode = true;
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
            case 3:
                this.homingAttack(screenSize, player);
                break;
            case 4:
                this.networkAttack(screenSize, player);
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
            for (let i = 0; i < 16 + this.extraAttacks; i++) {
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
            for (let i = 0; i < Phaser.Math.Between(2, 8 + this.extraAttacks); i++) {
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
            const centerX = screenSize.width / 2;
            const centerY = screenSize.height / 2;
    
            for (let i = 0; i < 12; i++) {
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

    private homingAttack(screenSize: { width: number; height: number }, player: Phaser.Physics.Arcade.Sprite) {
        if (this.scene.time.now - this.shootCooldown > 1000) {
            const allPoints = [
                { x: 0, y: 0 },
                { x: screenSize.width / 4, y: 0 },
                { x: screenSize.width / 2, y: 0 },
                { x: screenSize.width * 3 / 4, y: 0 },
                { x: screenSize.width, y: 0 },
                { x: screenSize.width, y: screenSize.height / 4 },
                { x: screenSize.width, y: screenSize.height / 2 },
                { x: screenSize.width, y: screenSize.height * 3 / 4 },
                { x: screenSize.width, y: screenSize.height },
                { x: screenSize.width / 2, y: screenSize.height },
                { x: screenSize.width / 4, y: screenSize.height },
                { x: 0, y: screenSize.height },
                { x: 0, y: screenSize.height * 3 / 4 },
                { x: 0, y: screenSize.height / 2 },
                { x: 0, y: screenSize.height / 4 },
            ];

            const shuffledPoints = Phaser.Utils.Array.Shuffle(allPoints);
            const spawnPoints = shuffledPoints.slice(0, Math.floor(shuffledPoints.length / 3));
    
            for (let i = 0; i < spawnPoints.length; ++i) {
                const { x, y } = spawnPoints[i];
                const target = new Phaser.Math.Vector2(player.x, player.y);
                this.projectiles.push(new Projectile(this.scene, x, y, "pink_arrow", target, 15));
            }
    
            this.shootCooldown = this.scene.time.now;
        }
    }

    private networkAttack(screenSize: { width: number; height: number }, player: Phaser.Physics.Arcade.Sprite) {
        if (this.scene.time.now - this.shootCooldown > 600) {
            const startPoints = [
                { x: screenSize.width / 2, y: screenSize.height / 2 },
                { x: screenSize.width / 4, y: screenSize.height / 4 },
                { x: screenSize.width / 4 * 3, y: screenSize.height / 4 },
                { x: screenSize.width / 4, y: screenSize.height / 4 * 3 },
                { x: screenSize.width / 4 * 3, y: screenSize.height / 4 * 3 }
            ];

            const startPoint = Phaser.Utils.Array.GetRandom(startPoints);

            for (let i = 0; i < 5; ++i) {
                const angle =  Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
                const offset = 135 * Math.sin(i * (2 * Math.PI / 5));
                const x = startPoint.x + offset * Math.cos(angle);
                const y = startPoint.y / 2 + offset * Math.sin(angle);
                const target = new Phaser.Math.Vector2(player.x, player.y);

                this.projectiles.push(new Projectile(this.scene, x, y, "fireball", target, 10));
            }

            this.shootCooldown = this.scene.time.now;
        }
    }
}

class Projectile {
    x: number;
    y: number;
    obsType: string;
    img: Phaser.Physics.Arcade.Image;
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

        this.img = scene.physics.add.image(x, y, obsType).setScale(size);
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
    private keyUp!: Phaser.Input.Keyboard.Key;
    private keyLeft!: Phaser.Input.Keyboard.Key;
    private keyDown!: Phaser.Input.Keyboard.Key;
    private keyRight!: Phaser.Input.Keyboard.Key;
    private projectiles!: Phaser.Physics.Arcade.Group;
    private screenSize!: { width: number; height: number };
    private playerSpeed: number = 4;
    private attacks!: Attacks;
    private timeElapsed: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private isPaused: boolean = false;
    private pauseText!: Phaser.GameObjects.Text;
    private musicTracks: Phaser.Sound.BaseSound[] = [];
    private currentTrackIndex: number = 0;
    private currentTrack!: Phaser.Sound.BaseSound;
    private defaultMusicVolume: number = 0.1;

    constructor() {
        super("Game");
    }

    getScore() {
        return Math.floor(this.timeElapsed / 30);
    }

    preload() {
        this.load.image("player", require("@/assets/player.png"));
        this.load.image("fireball", require("@/assets/fireball.png"));
        this.load.image("arrow", require("@/assets/arrow.png"));
        this.load.image("pink_arrow", require("@/assets/pink_arrow.png"));

        this.load.audio("Albatros", "../src/assets/music/Albatros.mp3");
        this.load.audio("Blip-Master", "../src/assets/music/Blip-Master.mp3");
        this.load.audio("Bit-Fight11", "../src/assets/music/Bit-Fight11.mp3");
        this.load.audio("Dreamz", "../src/assets/music/Dreamz.mp3");
        this.load.audio("Fair-N-Square", "../src/assets/music/Fair-N-Square.mp3");
        this.load.audio("Game-On-by-Tricycle", "../src/assets/music/Game-On-by-Tricycle.mp3");
        this.load.audio("Moving-to-Miami", "../src/assets/music/Moving-to-Miami.mp3");
        this.load.audio("Press-X-Twice", "../src/assets/music/Press-X-Twice.mp3");
        this.load.audio("Racing-Hearts", "../src/assets/music/Racing-Hearts.mp3");
        this.load.audio("Soon", "../src/assets/music/Soon.mp3");
        this.load.audio("Tiger-Tracks", "../src/assets/music/Tiger-Tracks.mp3");
        this.load.audio("Time-By-Several-Definitions", "../src/assets/music/Time-By-Several-Definitions.mp3");
        this.load.audio("Virtual", "../src/assets/music/Virtual.mp3");
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
            "",
            { font: "96px Pixeboy", color: "#ffffff" }
        ).setOrigin(0.5, 0.6);
        this.scoreText.setDepth(1);

        if (this.input.keyboard) {
            this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        }

        this.physics.add.collider(
            this.player,
            this.projectiles,
            (player, projectile) => {
                console.log("Collider triggered");
                this.handleCollision(
                    player as Phaser.Types.Physics.Arcade.GameObjectWithBody,
                    projectile as Phaser.Types.Physics.Arcade.GameObjectWithBody
                );
            },
            undefined,
            this
        );

        this.musicTracks = [
            this.sound.add("Albatros", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Blip-Master", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Bit-Fight11", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Dreamz", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Fair-N-Square", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Game-On-by-Tricycle", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Moving-to-Miami", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Press-X-Twice", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Racing-Hearts", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Soon", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Tiger-Tracks", { loop: false, volume: this.defaultMusicVolume} ),
            this.sound.add("Time-By-Several-Definitions", { loop: false, volume: this.defaultMusicVolume }),
            this.sound.add("Virtual", { loop: false, volume: this.defaultMusicVolume })
        ];
        
        Phaser.Utils.Array.Shuffle(this.musicTracks);
        this.currentTrackIndex = Phaser.Math.Between(0, this.musicTracks.length - 1);
        this.playNextTrack();
    }

    update(time: number, delta: number) {
        if (this.isPaused) {
            if (this.input.keyboard!.checkDown(this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 250)) {
                this.restartGame();
            }
            return;
        }

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
        if (this.keyA.isDown || this.keyLeft.isDown && this.player.x > 0) {
            this.player.x -= this.playerSpeed;
        }

        if (this.keyD.isDown || this.keyRight.isDown && this.player.x < this.screenSize.width - this.player.width) {
            this.player.x += this.playerSpeed;
        }

        if (this.keyW.isDown || this.keyUp.isDown && this.player.y > 0) {
            this.player.y -= this.playerSpeed;
        }

        if (this.keyS.isDown || this.keyDown.isDown && this.player.y < this.screenSize.height - this.player.height) {
            this.player.y += this.playerSpeed;
        }
    }

    private handleCollision(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, projectile: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        console.log(this.player.body);
        console.log(projectile.body);
        console.log("Collision triggered", player, projectile);

        if (projectile instanceof Phaser.Physics.Arcade.Image) {
            projectile.destroy();

            console.log("Collision detected!");
            this.physics.pause();
            this.isPaused = true;

            this.pauseText = this.add.text(
                this.screenSize.width / 2,
                this.screenSize.height / 2,
                "Game over\nPress space", {
                    font: "48px Arial", color: "#ffffff", align: "center" }
            ).setOrigin(0.5);

            if (this.currentTrack) {
                this.currentTrack.stop();
            }
        }
    }

    private restartGame(): void {
        // Удалить текст паузы
        if (this.pauseText) {
            this.pauseText.destroy();
        }

        this.timeElapsed = 0;

        this.projectiles.clear(true, true);

        this.player.setPosition(this.screenSize.width / 2, this.screenSize.height / 2);

        this.physics.resume();

        this.isPaused = false;
    }

    private playNextTrack() {
        if (this.currentTrack) {
            this.currentTrack.stop();
        }

        this.currentTrackIndex++;

        if (this.currentTrackIndex === this.musicTracks.length) {
            Phaser.Utils.Array.Shuffle(this.musicTracks);
            this.currentTrackIndex = 0;
        }

        this.currentTrack = this.musicTracks[this.currentTrackIndex];

        this.currentTrack.play();
        console.log("Now playing", this.currentTrack.key);

        this.currentTrack.once("complete", () => {
            this.playNextTrack();
        });
    }
}