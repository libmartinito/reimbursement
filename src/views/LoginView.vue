<template>
    <section class="login">
        <div @click="goBack" class="login__back">
            <div class="login__back-icon"></div>
            <div class="login__back-copy">go back</div>
        </div>
        <div class="login__header">Login.</div>
        <form @submit.prevent="login" class="login__form">
            <input type="text" placeholder="Email" v-model="email" required />
            <div v-if="isEmailNotExisting" class="error">Email does not exist. Please register.</div>
            <input type="password" placeholder="Password" v-model="password" required />
            <div v-if="isPasswordWrong" class="error">Password did not match the email used. Please try again.</div>
            <base-button type="submit" mode="dark">Login</base-button>
        </form>
    </section>
</template>

<script>
import nprogress from 'nprogress'

    // import NProgress from 'nprogress'
    export default {
        data() {
            return {
                email: "",
                password: "",
                isEmailNotExisting: false,
                isPasswordWrong: false
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            updateIsEmailNotExisting(status) {
                this.isEmailNotExisting = status
            },
            updateIsPasswordWrong(status) {
                this.isPasswordWrong = status
            },
            async login() {
                this.updateIsEmailNotExisting(false)
                this.updateIsPasswordWrong(false)
                
                const status = await this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,                    
                })                

                if (status) {
                    if (status.toString().includes("User")) {
                        this.updateIsEmailNotExisting(true)
                        return
                    } else if (status.toString().includes("Password")) {
                        this.updateIsPasswordWrong(true)
                        return
                    }
                } 
                nprogress.start()
                this.email = "",
                this.password = ""

                nprogress.done()
                this.$router.push('/home')
            }
        }
    }
</script>

<style scoped>
    .login {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .login__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .login__form {
        display: flex;
        flex-direction: column;
        margin: 0.8rem 0.3rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        margin: 0.5rem 0rem;

    }
    .login__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .login__back-icon {
        background-image: url('../assets/back.svg');
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>