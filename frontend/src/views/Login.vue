<template>
<div id="login-form">
    <input type="text" v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button id="login-button" @click="login">Sign in</button>
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
            if (status) {
                this.$router.push("/menu");
            } else {
                this.errorMessage = "Введен неправильный пароль";
            }
        },
    },
};
</script>

<style>
body {
    background-color: black;
    color: white;
    font-family: ArcadeClassic, sans-serif;
    font-size: 32px;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

#login-form {
    width: 300px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

#title {
    font-family: "PixelGame", sans-serif;
    font-size: 96px;
    color: white;
    text-align: center;
    margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
    font-family: ArcadeClassic, sans-serif;
    font-size: 24px;
    padding: 10px 0;
    border: none;
    border-bottom: 2px solid white;
    background-color: black;
    color: white;
    text-align: center;
    outline: none;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

#login-button {
    font-family: ArcadeClassic, sans-serif;
    font-size: 24px;
    padding: 10px;
    border: 2px solid white;
    background-color: black;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

#login-button:hover {
    background-color: white;
    color: black;
}

#error-message {
    color: red;
    font-size: 18px;
    margin-top: 10px;
    text-align: center;
}
</style>