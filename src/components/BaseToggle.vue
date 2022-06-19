<template>
    <div @click="updateIsToggleShown" class="toggle">
        <div v-if="isToggleShown" class="toggle__mark"></div>
    </div>
</template>

<script>
    export default {
        props: ["checkedValue"],
        data() {
            return {
                isToggleShown: null
            }
        },
        methods: {
            updateIsToggleShown() {
                if (this.$store.getters.adminView === 'completed' || this.$store.getters.role === 'user' || this.$store.getters.role === 'hr') {
                    return
                } else {
                    this.isToggleShown = !this.isToggleShown
                }
            }
        },
        created() {
            if (this.checkedValue === 0) {
                this.isToggleShown = false
            } else {
                this.isToggleShown = true
            }
        }
    }
</script>

<style scoped>
    .toggle {
        border-radius: 2px;
        border: 1px solid var(--neutral-700);
        width: 0.9rem;
        height: 0.9rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .toggle__mark {
        background-color: var(--neutral-700);
        border-radius: 1px;
        width: 0.5rem;
        height: 0.5rem;
    }
</style>