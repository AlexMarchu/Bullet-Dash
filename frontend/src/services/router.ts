import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/views/Auth.vue";
import Game from "@/views/Game.vue";
// import Main from "../views/Main.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name: "login",
            component: Auth,
        },
        {
            path: "/main_menu",
            name: "main_menu",
            component: Auth,
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
        },
        {
            path: "/game",
            name: "game",
            component: Game,
        },
    ],
});

export default router;
