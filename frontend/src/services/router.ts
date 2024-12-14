import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Menu from "@/views/Menu.vue";
import Game from "@/views/Game.vue";
import Rating from "@/views/Rating.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            path: "/menu",
            name: "menu",
            component: Menu,
        },
        {
            path: "/game",
            name: "game",
            component: Game,
        },
        {
            path: "/rating",
            name: "rating",
            component: Rating,
        }
    ],
});

export default router;