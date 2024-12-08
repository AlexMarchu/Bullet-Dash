<template>
    <div id="game-container"></div>
</template>

<script>
import Phaser from "phaser";
import Game from "../game/game.ts";

export default {
    created() {
        this.$on('start', this.startGame);
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

</style>