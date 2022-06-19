<template>
    <section :class="mode">
        <div>{{ rowNumber }}</div>
        <div v-if="mode === 'overview'">{{ crf }}</div>
        <div>{{ date }}</div>
        <div v-if="mode !== 'overview'">{{ amount }}</div>
        <div v-if="mode === 'overview'">{{ status }}</div>
        <div v-if="mode !== 'overview'">{{ nature }}</div>
        <base-progress v-if="mode !== 'ticket' && mode !== 'create'" :actionBy="actionBy"></base-progress>
        <div v-if="mode !== 'ticket'" class="row__actions">
            <base-button @click="passRowToEditOrView" mode="darkSmall">View</base-button>
            <base-button v-if="mode === 'create'" @click="passRowToDelete" mode="redSmall">Delete</base-button>
        </div>
        <div v-if="mode === 'ticket'" class="row__actions">
            <base-toggle @click="passReimbursementId" :checkedValue="this.checkedValue"></base-toggle>
        </div>
    </section>
</template>

<script>
    export default {
        props: ["id", "reimbursementId", "rowNumber", "crf", "date", "amount", "status", "nature", "mode", "checkedValue"],
        data() {
            return {
                actionBy: null
            }
        },
        methods: {
            passRowToDelete() {
                this.$emit('deleteRow', this.rowNumber)
            },
            passRowToEdit() {
                this.$emit('editRow', this.rowNumber)
            },
            passRowToEditOrView() {
                if (this.mode === 'create') {
                    this.$emit('editRow', this.rowNumber)
                } else if (this.mode === 'overview') {
                    this.$emit('viewRow', this.id)
                }
            },
            passReimbursementId() {
                if (this.$store.getters.adminView === 'completed' || this.$store.getters.role === 'user' || this.$store.getters.role === 'hr') {
                    return
                } else {
                    this.$emit('updateCheckedRows', this.reimbursementId)
                }
            },
            async getActionBy() {
                try {
                    let response = await fetch("http://localhost:3333/api/ticket/" + this.id, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.actionBy = response[0].action_by
                } catch(error) {
                    console.log(error)
                }
            }
        },
        created() {
            this.getActionBy()
        }
    }
</script>

<style scoped>
    .row {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 0.5rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 1fr 1fr 1fr 2fr 2fr;
    }
    .create {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 0.5rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 1fr 1fr 1fr 2fr 2fr;
    }
    .overview {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 0.5rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 0.5fr 1fr 1fr 2fr 1.5fr 1fr;
    }
    .ticket {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 0.5rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
    }
    .row__actions {
        display: flex;
        gap: 0.8rem;
    }
</style>