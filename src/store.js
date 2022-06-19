import nprogress from 'nprogress'
import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            userId: null,
            token: null,
            isSignedIn: false,

            firstName: null,
            lastName: null,
            role: null,  

            adminView: null
        }
    },
    mutations: {
        setState(state, payload) {
            state.userId = payload.userId
            state.token = payload.token,
            state.isSignedIn = payload.status

            state.firstName = payload.firstName
            state.lastName = payload.lastName
            state.role = payload.role
        },
        signOut(state) {
            nprogress.start()
            localStorage.clear()
            state.userId = null,
            state.token = null,
            state.isSignedIn = false,
            state.firstName = null,
            state.lastName = null,
            state.role = null
            nprogress.done()
        },
        updateAdminView(state, payload) {
            state.adminView = payload.adminView
        }
    },
    actions: {
        async register(context, payload) {
            try {
                let response = await fetch("http://localhost:3333/api/auth/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: payload.firstName,
                        last_name: payload.lastName,
                        email: payload.email,
                        password: payload.password,
                        role: payload.role
                    })
                })
                response = await response.json()
                context.commit('setState', {
                    userId: response.user_id,
                    token: response.token,
                    status: true,

                    firstName: response.first_name,
                    lastName: response.last_name,
                    role: response.role
                })
                localStorage.setItem('userInfo', JSON.stringify({
                    userId: response.user_id,
                    token: response.token,
                    status: true,
                    firstName: response.first_name,
                    lastName: response.last_name,
                    role: response.role
                }))
                return response.code
            } catch(error) {
                console.log(error)
            }
        },
        async login(context, payload) {
            try {
                let response = await fetch("http://localhost:3333/api/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: payload.email,
                        password: payload.password
                    })
                })
                response = await response.json()
                context.commit('setState', {
                    userId: response.user_id,
                    token: response.token,
                    status: true,

                    firstName: response.first_name,
                    lastName: response.last_name,
                    role: response.role
                })
                localStorage.setItem('userInfo', JSON.stringify({
                    userId: response.user_id,
                    token: response.token,
                    status: true,
                    firstName: response.first_name,
                    lastName: response.last_name,
                    role: response.role
                }))
                return response.errors[0].message
            } catch(error) {
                console.log(error)
            }
            
        }
    },
    getters: {
        userId(state) {
            return state.userId
        },
        token(state) {
            return state.token
        },
        isSignedIn(state) {
            return state.isSignedIn
        },
        firstName(state) {
            return state.firstName
        },
        lastName(state) {
            return state.lastName
        },
        role(state) {
            return state.role
        },
        adminView(state) {
            return state.adminView
        }
    }
})

export default store