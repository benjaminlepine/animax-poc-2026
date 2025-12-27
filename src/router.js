import { createRouter, createWebHistory } from 'vue-router'
import TokenView from './views/TokenView.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/tk/:tokenId', name: 'token', component: TokenView, props: true },
    ],
})