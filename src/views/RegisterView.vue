<template>
    <section class="register">
        <div @click="goBack" class="register__back">
            <div class="register__back-icon"></div>
            <div class="register__back-copy">go back</div>
        </div>
        <div class="register__header">Register.</div>
        <form @submit.prevent="register" class="register__form">
            <input type="text" placeholder="First Name" v-model="firstName" required />
            <input type="text" placeholder="Last Name" v-model="lastName" required />
            <input type="text" placeholder="Email" v-model="email" required />
            <div v-if="isEmailNotUnique" class="error">Email is already registred. Please use a different one.</div>
            <input type="password" placeholder="Password" v-model="password" required />
            <input type="password" placeholder="Re-enter Password" v-model="passwordReEnter" required />
            <div v-if="isPasswordMismatched" class="error">Passwords do not match. Please try again.</div>
            <base-button type="submit" mode="dark">Register</base-button>
        </form>
    </section>
</template>

<script>
import nprogress from 'nprogress'

    export default {
        data() {
            return {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                passwordReEnter: "",
                isPasswordMismatched: false,
                isEmailNotUnique: false
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            updateIsPasswordMismatched() {
                if (this.password !== this.passwordReEnter) {
                    this.isPasswordMismatched = true
                } else {
                    this.isPasswordMismatched = false
                }
            },
            updateIsEmailNotUnique(status) {
                this.isEmailNotUnique = status
            },
            async register() {
                nprogress.start()
                if (!(this.password === this.passwordReEnter)) {
                    this.updateIsPasswordMismatched()
                    return
                }
                const status = await this.$store.dispatch('register', {
                    email: this.email,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName,
                })

                if (status) {
                    this.updateIsEmailNotUnique(true)
                    return
                }

                this.updateIsEmailNotUnique(false)

                this.firstName = "",
                this.lastName = "",
                this.email = "",
                this.password = "",
                this.passwordReEnter = ""

                nprogress.done()
                this.$router.push('/home')
            }
        }
    }
</script>

<style scoped>
    .register {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .register__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .register__form {
        display: flex;
        flex-direction: column;
        margin: 0.8rem 0.3rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        margin: 0.5rem 0rem;

    }
    .register__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .register__back-icon {
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