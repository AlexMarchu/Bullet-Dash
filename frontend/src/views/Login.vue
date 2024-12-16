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
    mounted() {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (token) {
            this.$router.push("/menu");
        } else if (username) {
            this.username = username;
        }
        window.addEventListener("keydown", this.handleKeyEnter);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyEnter);
    },
    methods: {
        handleKeyEnter(event) {
            if (event.key === "Enter") {
                this.login();
            }
        },
        async login() {
            if (this.username === "") {
                this.errorMessage = "Enter    nickname!";
                return;
            }

            this.errorMessage = "";
            const status = await authService.login(
                this.username,
                this.password
            );
            if (status) {
                this.$router.push("/menu");
            } else {
                this.errorMessage = "Wrong password!";
            }
        },
    },
};
</script>

<style scoped>
#login-form {
    width: 260px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

input {
    font-family: ArcadeClassic, sans-serif;
    font-size: 28px;
    color: white;
    padding: 2px;
    margin: 8px;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
}

input:focus {
    border-left: 3px solid white;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

#login-button {
    font-family: ArcadeClassic, sans-serif;
    font-size: 24px;
    padding: 8px;
    margin: 8px;
    border: 3px solid white;
    background-color: black;
    color: white;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
}

#login-button:hover {
    background-color: white;
    color: black;
}

#error-message {
    color: red;
    font-family: ArcadeClassic, sans-serif;
    font-size: 20px;
    text-align: center;
}
</style>