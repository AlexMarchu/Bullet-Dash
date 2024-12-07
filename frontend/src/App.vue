<template>
    <div id="app">
        <div id="game-container"></div>
        <div>
            <h1>Bullet Dash</h1>
            <button @click="startGame">Start Game</button>
        </div>
    </div>
</template>

<script>
import Phaser from "phaser";
import Game from "./game/game.ts";

export default {
    name: "App",
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
                        gravity: { y: 0 },
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
