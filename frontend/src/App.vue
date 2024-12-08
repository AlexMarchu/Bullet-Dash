<template>
    <div id="game-container"></div>
</template>

<script>
import Phaser from "phaser";
import Game from "./game/game.ts";

export default {
    name: "App",
    mounted() {
        this.startGame();
    },
    methods: {
        startGame() {
            const config = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: "game-container",
                scene: Game,
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        debug: false,
                    },
                },
            };

            new Phaser.Game(config);
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
