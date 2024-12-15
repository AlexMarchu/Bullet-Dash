<template>
<div id="login-form">
    <input type="text" v-model="username" placeholder="Username"/>
    <input type="password" v-model="password" placeholder="Password"/>
    <button id="login-button" @click="login">Войти</button>
</div>
</template>

<script>
import authService from "@/services/auth.ts";

export default {
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async login() {
            const status = await authService.login(this.username, this.password);
            if (status) {
                this.$router.push("/menu");
            } else {
                alert("SOME SHIT HAPPENED!");
            }
        }
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
</style>