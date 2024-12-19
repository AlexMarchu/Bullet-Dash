<template>
<div id="wrapper">
    <div id="lose-title">You lose!</div>
    <div id="score-title">Your score: {{ score }}</div>
    <div id="buttons-wrapper">
    <button @click="playAgain">Play again</button>
    <button @click="toMenu">To menu</button>
    </div>
</div>
</template>

<script>
import navigationSound from '../assets/sounds/navigation_1.mp3';

export default {
    data() {
        return {
            score: window.recentScore,
            audio: null,
        };
    },
    methods: {
        loadAudio() {
            this.audio = new Audio(navigationSound);
        },
        playSound() {
            if (this.audio) {
                this.audio.currentTime = 0;
                this.audio.play();
            }
        },
        playAgain() {
            this.playSound();
            this.$router.push("/game");
        },
        toMenu() {
            this.playSound();
            this.$router.push("/menu");
        }
    },
    mounted() {
        this.loadAudio();
    },
};
</script>

<style scoped>
#wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: ArcadeClassic, sans-serif;
    color: white;
}

#lose-title {
    font-size: 34px;
    color: red;
}

#score-title {
    font-size: 28px;
}

#buttons-wrapper {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

button {
    font-family: ArcadeClassic, sans-serif;
    font-size: 24px;
    padding: 8px;
    margin: 8px;
    border: 3px solid white;
    background-color: black;
    color: white;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
    width: 150px;
}

button:hover {
    background-color: white;
    color: black;
}
</style>