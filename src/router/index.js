import { createRouter, createWebHistory } from "vue-router"
import EntryView from "../views/EntryView.vue"
import RegisterView from "../views/RegisterView.vue"
import LoginView from "../views/LoginView.vue"
import HomeView from "../views/HomeView.vue"
import CreateView from "../views/CreateView.vue"
import PendingView from "../views/PendingView.vue"
import CompletedView from "../views/CompletedView.vue"
import ForecastView from "../views/ForecastView.vue"
import TicketView from "../views/TicketView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'entry',
      component: EntryView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pending',
      name: 'pending',
      component: PendingView
    },
    {
      path: '/completed',
      name: 'completed',
      component: CompletedView
    },
    {
      path: '/ticket/:ticketId',
      name: 'ticket',
      component: TicketView,
      props: true
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/forecast',
      name: 'forecast',
      component: ForecastView
    }
  ],
});


router.beforeEach((to) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (!userInfo) {
    if (to.name !== 'entry' && to.name !== 'register' && to.name !== 'login') {
      return { name: 'entry' }
    }
  }
  if (userInfo && (to.name === 'entry' || to.name === 'register' || to.name === 'login')) {
    return { name: 'home' }
  }
})

export default router;
