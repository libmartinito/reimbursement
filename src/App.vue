<template>
  <div class="container">
    <the-header></the-header>
    <router-view v-slot="{Component, route}">
      <component :is="Component" :key="route.path"/>
    </router-view>
  </div>
</template>

<script>
  import TheHeader from "./components/TheHeader.vue"

  export default {
    components: {
      TheHeader,
    },
    beforeCreate() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      if (userInfo) {
        this.$store.commit('setState', {
          userId: userInfo.userId,
          token: userInfo.token,
          status: userInfo.status,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userInfo.role
        })
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --green-800: #166534;
  --red-800: #991b1b;
  --neutral-50: #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e5e5e5;
  --neutral-300: rgba(212, 212, 212, 0.5);
  --neutral-700: #404040;
  background-color: var(--neutral-50);
  color: var(--neutral-700);
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  box-sizing: inherit;
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>