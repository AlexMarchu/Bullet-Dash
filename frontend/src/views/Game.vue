<template>
<div id="game-container"></div>
<div style="font-family:Pixeboy; position:absolute; visibility:hidden;">.</div>
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
        window.addEventListener("keydown", this.handleKeyEsc);
        this.startGame();
        this.game.events.on("lose", this.onLose);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyEsc);
    },
    methods: {
        handleKeyEsc(event) {
            if (event.key === "Escape") {
                this.onLose();
            }
        },
        startGame() {
            const config = {
                type: Phaser.AUTO,
                parent: "game-container",
                width: 800,
                height: 600,
                scene: Game,
                fps: {
                    target: 60
                },
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
            this.game.scene.start("Game");
        },
        onLose() {
            const score = this.game.scene.getScene("Game").getScore();
            authService.updateUserScore(score);
            window.recentScore = score;
            this.game.destroy();
            this.$router.push("/lose");
        }
    },
};
</script>

<style scoped>
#game-container {
    width: 100%; 
    height: 100%; 
    position: fixed;
    top: 0; 
    left: 0;
}
</style>