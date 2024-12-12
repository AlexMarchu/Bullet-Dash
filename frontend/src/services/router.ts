import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/views/Auth.vue";
import Game from "@/views/Game.vue";
import Menu from "@/views/Menu.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name: "login",
            component: Auth,
        },
        {
            path: "/game",
            name: "game",
            component: Game,
        },
        {
            path: "/menu",
            name: "menu",
            component: Menu,
        }
    ],
});

export default router;