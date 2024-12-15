<template>
    <div id="login-form">
        <input type="text" v-model="username" placeholder="Username" />
        <input type="password" v-model="password" placeholder="Password" />
        <button id="login-button" @click="login">Войти</button>
        <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script>
import authService from "@/services/auth.ts";

export default {
    data() {
        return {
            username: "",
            password: "",
            errorMessage: "",
        };
    },
    created() {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (token) {
            this.$router.push("/menu");
        } else if (username) {
            this.username = username;
        }
    },
    methods: {
        async login() {
            this.errorMessage = "";
            const status = await authService.login(
                this.username,
                this.password
            );
            // const status = true;
            if (status) {
                this.$router.push("/menu");
            } else {
                this.errorMessage = "Введен неправильный пароль";
                // alert("Упс! Что-то пошло не так...");
            }
        },
    },
};
</script>

<style>
#login-form {
    width: 200px;
    display: flex;
    flex-direction: column;
    row-gap: 5pt;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#login-button {
    background-color: #f06640;
}

#error-message {
    color: red;
    margin-top: 0.1rem;
    font-size: smaller;
    text-align: center;
}
</style>
