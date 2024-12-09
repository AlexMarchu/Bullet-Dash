<template>
    <div id="login-form">
        <input type="text" v-model="username" placeholder="Username" />
        <input type="password" v-model="password" placeholder="Password" />
        <button id="login-button" @click="login">Войти</button>
    </div>
</template>

<script>
import authService from "./services/auth.ts";

export default {
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async login() {
            // const status = await authService.login();
            const status = true;
            if (status) {
            } else {
            }
        },
    },
};
</script>

<style></style>
