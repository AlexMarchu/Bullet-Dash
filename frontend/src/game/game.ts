import Phaser from "phaser";

export class Attacks {
    private scene: Game;
    private attackTimer: number = 0;
    private shootCooldown: number = 0;
    private currentPattern: number = 0;
    private nextPattern: number = Phaser.Math.Between(0, 2);
    private hardMode: boolean = false;
    private hardModeTimer: number = 0;
    private extraAttacks: number = 0;
    private offset: number = 0;

    constructor(scene: Game) {
        this.scene = scene;
    }

    public update(player: Phaser.Physics.Arcade.Sprite, screenSize: { width: number; height: number }) {
        const hardTime = 30;

        if (this.scene.time.now - this.attackTimer > 2000) {
            this.attackTimer = this.scene.time.now;
            this.currentPattern = this.nextPattern;
            this.nextPattern = Phaser.Math.Between(0, 4);

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
    }

    private radialAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 250) {
            console.log("CREATING");
            this.shootCooldown = this.scene.time.now;

            for (let i = 0; i < 16 + this.extraAttacks; i++) {
                const angle = Phaser.Math.DegToRad((360 / (12 + this.extraAttacks)) * i + this.offset);
                const x = screenSize.width / 2;
                const y = screenSize.height / 2;
                const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
    
                const projectile = new Projectile(this.scene, x, y, "fireball", direction, 10);
                this.scene.projectiles.add(projectile);
            }
            this.offset += 10;
        }
    }

    private arrowAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 500) {
            this.shootCooldown = this.scene.time.now;

            const direction = Phaser.Math.Between(0, 3);
            for (let i = 0; i < Phaser.Math.Between(2, 8 + this.extraAttacks); i++) {
                let x = 0, y = 0;
                let directionVector: Phaser.Math.Vector2;
    
                if (direction === 0) {
                    x = Phaser.Math.Between(0, screenSize.width);
                    y = 0;
                    directionVector = new Phaser.Math.Vector2(0, 1);
                } else if (direction === 1) {
                    x = Phaser.Math.Between(0, screenSize.width);
                    y = screenSize.height;
                    directionVector = new Phaser.Math.Vector2(0, -1);
                } else if (direction === 2) {
                    x = 0;
                    y = Phaser.Math.Between(0, screenSize.height);
                    directionVector = new Phaser.Math.Vector2(1, 0);
                } else {
                    x = screenSize.width;
                    y = Phaser.Math.Between(0, screenSize.height);
                    directionVector = new Phaser.Math.Vector2(-1, 0);
                }
    
                const projectile = new Projectile(this.scene, x, y, "arrow", directionVector, 15);
                this.scene.projectiles.add(projectile);
            }
        }
    }

    private edgeAttack(screenSize: { width: number; height: number }) {
        if (this.scene.time.now - this.shootCooldown > 500) {
            this.shootCooldown = this.scene.time.now;

            const centerX = screenSize.width / 2;
            const centerY = screenSize.height / 2;
    
            for (let i = 0; i < 12; i++) {
                const angle = Phaser.Math.DegToRad((360 / 8) * i);
                const radius = 1;
                const startX = centerX + Math.cos(angle) * radius;
                const startY = centerY + Math.sin(angle) * radius;
    
                const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
    
                const projectile = new Projectile(this.scene, startX, startY, "fireball", direction, 10);
                this.scene.projectiles.add(projectile);
            }
        }
    }

    private homingAttack(screenSize: { width: number; height: number }, player: Phaser.Physics.Arcade.Sprite) {
        if (this.scene.time.now - this.shootCooldown > 1000) {
            this.shootCooldown = this.scene.time.now;

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
                const direction = new Phaser.Math.Vector2(player.x - x, player.y - y).normalize();
    
                const projectile = new Projectile(this.scene, x, y, "pink_arrow", direction, 15);
                this.scene.projectiles.add(projectile);
            }
        }
    }

    private networkAttack(screenSize: { width: number; height: number }, player: Phaser.Physics.Arcade.Sprite) {
        if (this.scene.time.now - this.shootCooldown > 600) {
            this.shootCooldown = this.scene.time.now;

            const startPoints = [
                { x: screenSize.width / 2, y: screenSize.height / 2 },
                { x: screenSize.width / 4, y: screenSize.height / 4 },
                { x: screenSize.width / 4 * 3, y: screenSize.height / 4 },
                { x: screenSize.width / 4, y: screenSize.height / 4 * 3 },
                { x: screenSize.width / 4 * 3, y: screenSize.height / 4 * 3 }
            ];
    
            const startPoint = Phaser.Utils.Array.GetRandom(startPoints);
    
            for (let i = 0; i < 5; ++i) {
                const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
                const offset = 135 * Math.sin(i * (2 * Math.PI / 5));
                const x = startPoint.x + offset * Math.cos(angle);
                const y = startPoint.y / 2 + offset * Math.sin(angle);
    
                const direction = new Phaser.Math.Vector2(player.x - x, player.y - y).normalize();
    
                const projectile = new Projectile(this.scene, x, y, "fireball", direction, 10);
                this.scene.projectiles.add(projectile);
            }
        }
    }
}

class Projectile extends Phaser.Physics.Arcade.Image {
    public speed: number;
    public direction: Phaser.Math.Vector2;

    constructor(
        scene: Game,
        x: number,
        y: number,
        obsType: string,
        direction: Phaser.Math.Vector2,
        speed: number,
        size: number = 1,
        offscreenDisable: boolean = false
    ) {
        super(scene, x, y, obsType);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(size);
        this.speed = speed / 3;
        this.direction = direction.normalize();

        const rotation = Math.atan2(direction.y, direction.x);
        this.setRotation(rotation);
    }

    move(): void {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
    }

    offScreen(screenSize: { width: number; height: number }): boolean {
        return (
            this.x < -this.displayWidth ||
            this.x > screenSize.width ||
            this.y < -this.displayHeight ||
            this.y > screenSize.height
        );
    }

    update(screenSize: { width: number; height: number }): void {
        this.move();
        if (this.offScreen(screenSize)) {
            this.destroy();
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
    public projectiles!: Phaser.Physics.Arcade.Group;
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
            this.sound.add("Tiger-Tracks", { loop: false, volume: this.defaultMusicVolume }),
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

        this.projectiles.getChildren().forEach((projectile) => {
            (projectile as Projectile).update(this.screenSize);
            
            if ((projectile as Projectile).offScreen(this.screenSize)) {
                this.projectiles.remove(projectile, true, true);
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
        // console.log(this.player.body);
        // console.log(projectile.body);
        // console.log("Collision triggered", player, projectile);

        // if (projectile instanceof Phaser.Physics.Arcade.Image) {
        //     projectile.destroy();

        //     console.log("Collision detected!");
        //     this.physics.pause();
        //     this.isPaused = true;

        //     this.pauseText = this.add.text(
        //         this.screenSize.width / 2,
        //         this.screenSize.height / 2,
        //         "Game over\nPress space", {
        //             font: "48px Arial", color: "#ffffff", align: "center" }
        //     ).setOrigin(0.5);

        //     if (this.currentTrack) {
        //         this.currentTrack.stop();
        //     }
        // }
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