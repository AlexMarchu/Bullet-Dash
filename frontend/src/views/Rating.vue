<template>
<div id="wrapper">
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in usersData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.score }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import authService from "@/services/auth.ts";

export default {
    data() {
        return {
            usersData: []
        };
    },
    mounted() {
        this.fetchUsersScores();
        window.addEventListener("keydown", this.handleKeyEsc);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyEsc);
    },
    methods: {
        handleKeyEsc(event) {
            if (event.key === "Escape") {
                this.$router.push("/menu");
            }
        },
        async fetchUsersScores() {
            this.usersData = await authService.getUsersScores();
        }
    }
}
</script>

<style scoped>
#wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 16%;
    left: 50%;
    transform: translate(-50%, 0);
}

table {
    font-family: ArcadeClassic, sans-serif;
    text-align: center;
    border-spacing: 14px;
}

table thead {
    font-size: 34px;
    color: white;
}

table tbody {
    font-size: 28px;
    color: rgb(255, 255, 255, 0.8);
}

table tbody tr:nth-child(1) {
    color: #FFD700;
}

table tbody tr:nth-child(2) {
    color: #ffe34b;
}

table tbody tr:nth-child(3) {
    color: #ffe86e;
}
</style>