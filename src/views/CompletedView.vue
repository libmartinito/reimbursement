<template>
    <section class="completed">
        <div class="completed__header">
            <div class="completed__title">Completed Tickets</div>
            <form @submit.prevent="searchTicket">
                <div class="completed__wrapper">
                    <input type="text" placeholder="Search" v-model="searchInput"/>
                    <div @click="clearSearchInput" class="completed__clear"></div>
                </div>                
            </form>
        </div>
        <div class="completed__divider"></div>
        <div class="completed__tickets">
            <div class="completed__table">
                <div class="completed__column-headers">
                    <div>Row #</div>
                    <div>CRF #</div>
                    <div>Date Filed</div>
                    <div>Status</div>
                    <div>Progress</div>
                    <div>Action</div>
                </div>
                <base-row
                    @viewRow="viewTicket($event)"
                    class="completed__row"
                    v-for="ticket in tickets"
                    :key="ticket.rowNumber"
                    :id="ticket.id"
                    :rowNumber="ticket.rowNumber"
                    :crf="ticket.crf"
                    :date="ticket.created_at.slice(0, 10)"
                    :status="ticket.status"
                    mode="overview"
                ></base-row>
            </div>
        </div>
    </section>
</template>

<script>
import nprogress from 'nprogress'

    export default {
        data() {
            return {
                tickets: null,
                searchInput: null
            }
        },
        methods: {
            filterUserTickets() {
                const filteredTickets = []
                this.tickets.forEach(ticket => {
                    if (ticket.status === 'Completed' || ticket.status === 'Rejected') {
                        filteredTickets.push(ticket)
                    }
                })
                this.tickets = filteredTickets
            },
            filterAdminTickets() {
                const rolesArr = ['director', 'hsu', 'hr', 'sdas', 'finance', 'none']
                const role = this.$store.getters.role
                const roleIndex = rolesArr.indexOf(role)
                rolesArr.splice(0, roleIndex + 1)
                const filteredTickets = []
                this.tickets.forEach(ticket => {
                    if (rolesArr.includes(ticket.action_by)) {
                        filteredTickets.push(ticket)
                    }
                })
                this.tickets = filteredTickets
            },
            updateRowNumbers() {
                let rowNumber = 1
                this.tickets.forEach(ticket => {
                    ticket.rowNumber = rowNumber
                    rowNumber += 1
                })
            },
            createLookupObj(pattern) {
                const patternLength = pattern.length
                const lookupObj = {}

                for (let i = 0; i < pattern.length; i += 1) {
                    if ( i === pattern.length - 1) {
                        lookupObj[pattern[i]] = patternLength
                    } else {
                        const value = patternLength - i - 1
                        lookupObj[pattern[i]] = value
                    }
                }
                console.log(lookupObj)
                return lookupObj
            },
            getNewIndex(pattern, text, shift) {
                let initialIndex = pattern.length - 1
                let shiftedIndex = shift + initialIndex

                while(pattern[initialIndex] === text[shiftedIndex]) {
                    initialIndex -= 1
                    shiftedIndex -= 1
                }
            },
            getShift(obj, pattern, text, index) {
                if ( Object.keys(obj).includes(text[index])) {
                    let shift = obj[text[index]]
                    return shift
                } else {
                    let shift = obj[pattern[pattern.length - 1]]
                    return shift
                }
            },
            search(pattern, text) {
                const lookupObj = this.createLookupObj(pattern)
                let shift = 0
                let textSubstr = text.substring(0, pattern.length)

                while (pattern !== textSubstr) {
                    const newIndex = this.getNewIndex(pattern, text, shift)
                    shift += this.getShift(lookupObj, pattern, text, newIndex)
                    if (shift > text.length - 4) {
                        shift = -1
                        return shift
                    }
                    textSubstr = text.substring(shift, shift + pattern.length)
                }

                return shift
            },
            searchTicket() {
                let text = ""
                this.tickets.forEach(ticket => {
                    text += ticket.crf.toString()
                })
                const pattern = this.searchInput.toString()
                const shift = this.search(pattern, text)
                let index = 0
                if (shift === -1) {
                    index = -1
                } else {
                    index = shift / pattern.length
                }
                if (index !== -1) {
                    this.tempTickets = this.tickets
                    this.tickets = [this.tickets[index]]
                    this.updateRowNumbers()
                } else {
                    return
                }   
            },
            clearSearchInput() {
                this.searchInput = null
                this.tickets = this.tempTickets
                this.updateRowNumbers()
            },
            async getUserTickets() {
                nprogress.start()
                try {
                    const url = "http://localhost:3333/api/ticket/user/" + this.$store.getters.userId
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.tickets = response
                    this.tempTickets = response
                    this.filterUserTickets()
                    this.updateRowNumbers()
                } catch(error) {
                    console.log(error)
                }
                nprogress.done()
            },
            async getAllTickets() {
                nprogress.start()
                try {
                    let response = await fetch("http://localhost:3333/api/ticket", {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.tickets = response
                    this.tempTickets = response
                    this.filterAdminTickets()
                    this.updateRowNumbers()
                } catch(error) {
                    console.log(error)
                }
                nprogress.done()
            },
            viewTicket(ticketId) {
                this.$router.push('/ticket/' + ticketId)
            }
        },
        created() {
            if (this.$store.getters.role === 'user') {
                this.getUserTickets()
            } else {
                this.getAllTickets()
                this.$store.commit('updateAdminView', {
                    adminView: 'completed'
                })
            }
            
        }
    }
</script>

<style scoped>
    .completed{
        width: 900px;
    }
    .completed__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .completed__wrapper {
        border: 1px solid var(--neutral-700);
        border-radius: 2px;
        display: flex;
        align-items: center;
        height: 33px;
        width: 10rem;
        padding: 0.3rem;
    }
    .completed__clear {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }
    .completed__title {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 8rem;
        margin: 0.5rem 0rem;
        border: none;
    }
    input:focus {
        outline: none;
    }
    .completed__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .completed__column-headers {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 1rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 0.5fr 1fr 1fr 2fr 1.5fr 1fr;
    }
    .completed__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .completed__row:nth-child(even) {
        background-color: var(--neutral-100);
    }
</style>