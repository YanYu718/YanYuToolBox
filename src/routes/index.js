import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        component: () => import('../views/information.vue'),
    },
    {
        name: 'information',
        path: '/information',
        component: () => import('../views/information.vue'),
    },
    {
        name: 'magisk',
        path: '/magisk',
        component: () => import('../views/Magisk.vue'),
    },
    {
        name: 'phonetool',
        path: '/phonetool',
        component: () => import('../views/Phonetool.vue'),
    },
    {
        name: 'bat',
        path: '/bat',
        component: () => import('../views/Bat.vue'),
    },
    {
        name: 'about',
        path: '/about',
        component: () => import('../views/About.vue'),
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router