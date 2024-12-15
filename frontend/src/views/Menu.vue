<template>
    <div id="wrapper">
        <button id="play-button" @click="startGame">Играть</button>
        <button id="rating-button" @click="openRating">Рейтинг</button>
        <button id="logout-button" @click="logout">Сменить аккаунт</button>
    </div>
</template>

<script>
export default {
    methods: {
        startGame() {
            this.$router.push("/game");
        },
        openRating() {
            this.$router.push("/rating");
        },
        logout() {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
    },
};
</script>

<style>
#wrapper {
    width: 160px;
    display: flex;
    flex-direction: column;
    row-gap: 5pt;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

button {
    background-color: #f06640;
}
</style>
