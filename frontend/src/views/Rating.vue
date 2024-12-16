<template>
<table>
    <thead>
        <tr>
            <th>Место</th>
            <th>Никнейм</th>
            <th>Рекорд</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(user, index) in usersData" :key="index">
            <td>{{ index }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.score }}</td>
        </tr>
    </tbody>
</table>
</template>

<script>
import authService from "@/services/auth.ts";

export default {
    data() {
        return {
            usersData: [{
                username: "",
                score: 0
            }]
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

<style>

</style>