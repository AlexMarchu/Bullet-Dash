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
        <!-- <tr v-for="(leader, index) in leaders" :key="index">
            <td>{{ leader.index }}</td>
            <td>{{ leader.username }}</td>
            <td>{{ leader.maximumMoney }}</td>
        </tr> -->
    </tbody>
</table>
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
        window.addEventListener('keyup', this.handleKeyEsc);
    },
    beforeUnmount() {
        window.removeEventListener('keyup', this.handleKeyEsc);
    },
    methods: {
        handleKeyEsc(event) {
            if (event.key === 'Escape') {
                this.$router.push("/menu");
            }
        },
        async fetchUsersScores() {
            this.usersData = await authService.getUsersScores();
            console.log(userData);
        }
    }
}
</script>

<style>

</style>