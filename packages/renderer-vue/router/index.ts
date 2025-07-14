import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import mainPage from '../playground/main-page.vue';
import ChildComponent from '../components/ChildComponent.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: mainPage
  },
  {
    path: '/child',
    name: 'Child',
    component: ChildComponent 
  },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;  