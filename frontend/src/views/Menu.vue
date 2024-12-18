<template>
<div id="wrapper">
    <div id="title">Bullet Dash</div>
    <div id="menu">
        <div
            v-for="(item, index) in menuItems"
            :key="index"
            :class="['menu-item', { active: currentIndex === index }]"
            @click="selectItem(index)"
        >
        {{ item.label }}
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            menuItems: [
                { label: "Start Game", action: this.startGame },
                { label: "Leaderboard", action: this.openRating },
                { label: "Logout", action: this.logout },
                { label: "Quit Game", action: this.quit },
            ],
            currentIndex: 0,
        };
    },
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
        quit() {
            window.close();
        },
        selectItem(index) {
            this.currentIndex = index;
            this.menuItems[index].action();
        },
        handleKeyDown(event) {
            if (event.key === "ArrowDown" || event.key === "s") {
                this.currentIndex = (this.currentIndex + 1) % this.menuItems.length;
            } else if (event.key === "ArrowUp" || event.key === "w") {
                this.currentIndex = (this.currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
            } else if (event.key === "Enter" || event.key === " ") {
                this.menuItems[this.currentIndex].action();
            }
        },
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeyDown);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    },
};
</script>

<style scoped>
#wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#title {
    cursor: default;
    user-select: none;
    font-family: "PixelGame", sans-serif;
    font-size: 100px;
    color: white;
    text-align: center;
}

#menu {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.menu-item {
    font-family: ArcadeClassic, sans-serif;
    font-size: 32px;
    cursor: pointer;
    user-select: none;
    padding: 7px;
    color: rgb(89, 89, 89);
}

.menu-item:hover {
    color: rgba(255, 255, 255, 0.7);
}

.menu-item.active {
    color: white;
}
</style>