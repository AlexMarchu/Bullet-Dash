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
    rect: OBB;
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
        this.speed = speed;
        this.size = size;
        this.offscreenDisable = offscreenDisable;

        // Загружаем текстуру
        this.img = scene.add.image(x, y, obsType).setScale(size);
        this.startVector = new Phaser.Math.Vector2(x, y);
        this.endVector = endLoc;

        // Рассчитываем угол вращения
        this.rotation = Phaser.Math.RadToDeg(Math.atan2(y - endLoc.y, endLoc.x - x));
        this.img.setRotation(Phaser.Math.DegToRad(this.rotation));

        // Создаем прямоугольник OBB
        const rectSize = new Phaser.Math.Vector2(
            this.img.displayWidth,
            this.img.displayHeight
        );
        this.rect = new OBB(
            new Phaser.Math.Vector2(this.x, this.y),
            rectSize,
            Phaser.Math.DegToRad(-this.rotation)
        );
    }

    move(): void {
        try {
            // Вычисляем нормализованный вектор скорости
            const velocity = this.endVector
                .clone()
                .subtract(this.startVector)
                .normalize()
                .scale(this.speed);

            this.x += velocity.x;
            this.y += velocity.y;

            // Обновляем позицию изображения и OBB
            this.img.setPosition(this.x, this.y);
            this.rect.center.set(this.x, this.y);
        } catch {
            console.warn("Нулевой вектор движения!");
        }
    }

    render(): void {

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





class OBB {
    center: Phaser.Math.Vector2;
    size: Phaser.Math.Vector2;
    angle: number;

    private _tl: Phaser.Math.Vector2;
    private _tr: Phaser.Math.Vector2;
    private _bl: Phaser.Math.Vector2;
    private _br: Phaser.Math.Vector2;

    constructor(center: Phaser.Math.Vector2, size: Phaser.Math.Vector2, angle: number) {
        this.center = center;
        this.size = size;
        this.angle = angle;

        this._tl = new Phaser.Math.Vector2(-this.size.x / 2, this.size.y / 2);
        this._tr = new Phaser.Math.Vector2(this.size.x / 2, this.size.y / 2);
        this._bl = new Phaser.Math.Vector2(-this.size.x / 2, -this.size.y / 2);
        this._br = new Phaser.Math.Vector2(this.size.x / 2, -this.size.y / 2);
    }

    static fromRect(rect: Phaser.Geom.Rectangle): OBB {
        const center = new Phaser.Math.Vector2(rect.centerX, rect.centerY);
        const size = new Phaser.Math.Vector2(rect.width, rect.height);
        return new OBB(center, size, 0);
    }

    get orientation(): Phaser.Math.Vector2 {
        const o = new Phaser.Math.Vector2();
        o.setToPolar(this.angle, 1);
        return o;
    }

    get topleft(): Phaser.Math.Vector2 {
        return this.center.clone().add(this._tl.clone().rotate(this.angle));
    }

    get topright(): Phaser.Math.Vector2 {
        return this.center.clone().add(this._tr.clone().rotate(this.angle));
    }

    get bottomleft(): Phaser.Math.Vector2 {
        return this.center.clone().add(this._bl.clone().rotate(this.angle));
    }

    get bottomright(): Phaser.Math.Vector2 {
        return this.center.clone().add(this._br.clone().rotate(this.angle));
    }

    corners(): Phaser.Math.Vector2[] {
        return [this.topleft, this.topright, this.bottomright, this.bottomleft];
    }

    collideobb(obb: OBB): boolean {
        const axes = [
            this.orientation,
            this.orientation.clone().rotate(Math.PI / 2),
            obb.orientation,
            obb.orientation.clone().rotate(Math.PI / 2),
        ];

        for (const ax of axes) {
            let min1 = Infinity,
                max1 = -Infinity;
            let min2 = Infinity,
                max2 = -Infinity;

            for (const corner of this.corners()) {
                const projection = ax.dot(corner);
                min1 = Math.min(min1, projection);
                max1 = Math.max(max1, projection);
            }

            for (const corner of obb.corners()) {
                const projection = ax.dot(corner);
                min2 = Math.min(min2, projection);
                max2 = Math.max(max2, projection);
            }

            if (max1 < min2 || max2 < min1) {
                return false;
            }
        }

        return true;
    }

    colliderect(rect: Phaser.Geom.Rectangle): boolean {
        return this.collideobb(OBB.fromRect(rect));
    }
}



export default class Game extends Phaser.Scene {
    
    private player!: Phaser.Physics.Arcade.Sprite;
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private spawnTime!: number;
    private blinkTime!: number;
    private isBlinking: boolean = true;
    private speed: number = 2;

    private playerOBB!: OBB;

    private debugGraphics!: Phaser.GameObjects.Graphics;

    private projectiles: Projectile[] = [];
    private screenSize!: { width: number; height: number };

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('player', require('@/assets/player.png'));
        this.load.image('fireball', require('@/assets/fireball.png'));
        this.load.image('arrow', require('@/assets/arrow.png'));
    }

    create() {
        this.debugGraphics = this.add.graphics();
        this.player = this.physics.add.sprite(400, 300, "player").setOrigin(0.5, 0.5);
        this.player.setSize(50, 50);
        this.player.setDisplaySize(50, 50);
        this.player.setTint(0xfffafa);
        this.player.setCollideWorldBounds(true);

        this.screenSize = { width: this.sys.canvas.width, height: this.sys.canvas.height };

        // Пример создания снаряда
        this.projectiles.push(
            new Projectile(
                this,
                100,
                100,
                'fireball',
                new Phaser.Math.Vector2(400, 300),
                0
            )
        );

        this.projectiles.push(
            new Projectile(
                this,
                200,
                200,
                'arrow',
                new Phaser.Math.Vector2(200, 300),
                1
            )
        );

        this.playerOBB = new OBB(new Phaser.Math.Vector2(400, 300), new Phaser.Math.Vector2(50, 50), 0);

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
        this.playerOBB.center.set(this.player.x, this.player.y);
        this.playerOBB.angle = Phaser.Math.DegToRad(this.player.angle);

        this.projectiles.forEach((projectile) => {
            const collision = this.checkCollisionWith(projectile.rect);
            if (collision) {
                console.log('Collision detected with projectile!');
                projectile.img.setTint(0xff0000);
            } else {
                projectile.img.setTint(0xffffff);
            }
        });
        this.debugGraphics.clear();

        // Отображение OBB игрока
        this.debugDrawOBB(this.playerOBB, 0x00ff00);

        // Отображение OBB снарядов
        this.projectiles.forEach((projectile) => {
            this.debugDrawOBB(projectile.rect, 0xff0000);
        });

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

        this.projectiles = this.projectiles.filter((projectile) => {
            projectile.move();
            return !projectile.offScreen(this.screenSize);
        });
    }

    private debugDrawOBB(obb: OBB, color: number) {
        const corners = obb.corners();
        this.debugGraphics.lineStyle(1, color, 1);
        this.debugGraphics.strokePoints(
            [corners[0], corners[1], corners[2], corners[3], corners[0]],
            true
        );
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

    private checkCollisionWith(otherOBB: OBB): boolean {
        return this.playerOBB.collideobb(otherOBB);
    }
}
