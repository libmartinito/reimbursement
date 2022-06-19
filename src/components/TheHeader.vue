<template>
    <section class="header">
        <div class="header__banner">
            <div></div>
        </div>
        <div class="header__actions">
            <div @click="goToHome" class="home">Reimbursement System</div>
            <nav class="main-nav" v-if="this.$store.getters.isSignedIn">
                <ul class="main-nav__list">
                    <li @click="goToPendingView" class="main-nav__item">Pending Tickets</li>
                    <li @click="goToCompletedView" class="main-nav__item">Completed Tickets</li>
                    <li @click="goToCreateView" v-if="this.$store.getters.role === 'user'" class="main-nav__item">Create Ticket</li>
                    <li @click="goToForecastView" v-else class="main-nav__item">Forecasts</li>
                </ul>
            </nav>
            <base-button v-if="this.$store.getters.isSignedIn" @click="logout" mode="light">Logout</base-button>
        </div>        
    </section>
</template>

<script>
import nprogress from 'nprogress'

    export default {
        methods: {
            logout() {
                this.$store.commit('signOut')
                this.$router.push('/')
            },
            goToHome() {
                nprogress.start()
                this.$router.push('/home')
                nprogress.done()
            },
            goToCreateView() {
                nprogress.start()
                this.$router.push('/create')
                nprogress.done()
            },
            goToPendingView() {
                this.$router.push('/pending')
            },
            goToCompletedView() {
                this.$router.push('/completed')
            },
            goToForecastView() {
                this.$router.push('/forecast')
            }
        }
    }
</script>

<style scoped>
    .header {
        width: 900px;
        background-color: var(--green-800);
        color: var(--neutral-50);
        padding: 0.8rem 0rem;
    }
    .header__banner {
        display: flex;
        justify-content: center;
    }
    .header__banner div {
        background-image: url('../assets/logo.png');
        background-size: contain;
        width: 30rem;
        height: 6.2rem;
    }
    .header__actions {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.8rem 0rem;
    }
    .home {
        cursor: pointer;
    }
    .home:hover {
        color: var(--neutral-200);
    }
    .main-nav__list {
        display: flex;
        list-style-type: none;
        gap: 1rem;
    }
    .main-nav__item {
        font-size: 0.9rem;
        cursor: pointer
    }
    .main-nav__item:hover {
        color: var(--neutral-200);
    }
</style>