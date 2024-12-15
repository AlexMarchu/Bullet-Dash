<template>
<div id="game-container"></div>
</template>

<script>
import Phaser from "phaser";
import Game from "@/game/game.ts";
import authService from "@/services/auth.ts";

export default {
    data() {
        game: Phaser.Game;
    },
    mounted() {
        window.addEventListener('keyup', this.handleKeyEsc);
        this.startGame();
    },
    beforeUnmount() {
        window.removeEventListener('keyup', this.handleKeyEsc);
    },
    methods: {
        handleKeyEsc(event) {
            if (event.key === 'Escape') {
                authService.updateUserScore(localStorage.getItem("username"), this.game.scene.getScene('Game').getScore());
                this.game.destroy();
                this.$router.push("/menu");
            }
        },
        startGame() {
            const config = {
                type: Phaser.AUTO,
                parent: "game-container",
                width: 800,
                height: 600,
                scene: Game,
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        debug: false,
                    },
                },
                scale: {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.NO_CENTER,
                }
            };

            this.game = new Phaser.Game(config);
        },
    },
};
</script>

<style>
#game-container {
    width: 100%; 
    height: 100%; 
    position: fixed;
    top: 0; 
    left: 0;
}
</style>