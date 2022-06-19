<template>
    <div class="progress">
        <div  class="progress__dark" v-for="item in completed"></div>
        <div  class="progress__light" v-for="item in pending"></div>
    </div>
</template>

<script>
    export default {
        props: ["actionBy"],
        data() {
            return {
                completed: [],
                pending: []
            }
        }, 
        methods: {
            updateStatus() {
                this.completed = []
                this.pending = []
                const roles = ['director', 'hsu', 'hr', 'sdas', 'finance']
                const roleIndex = roles.indexOf(this.actionBy)

                if (this.actionBy === 'none') {
                    for (let i = 0; i < roles.length; i++) {
                        this.completed.push(roles[i])
                    }
                } else {
                    
                    for (let i = 0; i < roleIndex; i++) {
                        this.completed.push(roles[i])
                    }
                    for (let i = roleIndex; i < roles.length; i++) {
                        this.pending.push(roles[i])
                    }
                }             
            }
        },
        created() {
            this.updateStatus()
        },
        beforeUpdate() {
            this.updateStatus()
        }
    }
</script>

<style scoped>
    .progress {
        display: flex;
        gap: 2px;
    }
    .progress__dark {
        width: 20px;
        height: 10px;
        background-color: var(--neutral-700);
        border: 2px solid var(--neutral-700);
    }
    .progress__light {
        width: 20px;
        height: 10px;
        border: 2px solid var(--neutral-700);
    }
</style>