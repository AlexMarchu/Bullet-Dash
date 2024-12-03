import Phaser from "phaser";

export default class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        // Загрузка ресурсов
    }

    create() {
        // Создание объектов игры
        this.add.text(100, 100, "Hello Phaser", { color: "#ffffff" });
    }

    update() {
        // Обновление логики игры
    }
}
