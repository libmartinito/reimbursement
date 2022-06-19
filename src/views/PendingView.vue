<template>
    <section class="pending">
        <div class="pending__header">
            <div class="pending__title">Pending Tickets</div>
            <form @submit.prevent="searchTicket">
                <div class="pending__wrapper">
                    <input type="text" placeholder="Search" v-model="searchInput"/>
                    <div @click="clearSearchInput" class="pending__clear"></div>
                </div>
            </form>
        </div>
        <div class="pending__divider"></div>
        <div class="pending__tickets">
            <div class="pending__table">
                <div class="pending__column-headers">
                    <div>Row #</div>
                    <div>CRF #</div>
                    <div>Date Filed</div>
                    <div>Status</div>
                    <div>Progress</div>
                    <div>Action</div>
                </div>
                <base-row
                    @viewRow="viewTicket($event)"
                    class="pending__row"
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
                searchInput: null,
                tempTickets: null
            }
        },
        methods: {
            filterUserTickets() {
                const filteredTickets = []
                this.tickets.forEach(ticket => {
                    if (ticket.status !== 'Completed' && ticket.status !== 'Rejected') {
                        filteredTickets.push(ticket)
                    }
                })
                this.tickets = filteredTickets
                this.tempTickets = filteredTickets
                console.log(this.tickets)
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
                return lookupObj
            },
            getNewIndex(pattern, text, shift) {
                let initialIndex = pattern.length - 1
                let shiftedIndex = shift + initialIndex

                while(pattern[initialIndex] === text[shiftedIndex]) {
                    initialIndex -= 1
                    shiftedIndex -= 1
                }
                return shiftedIndex
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
            async getTicketsFilteredByRole() {
                nprogress.start()
                try {
                    const url = "http://localhost:3333/api/ticket/role/" + this.$store.getters.role
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
                    this.updateRowNumbers()
                } catch(error) {
                    console.log(error)
                }
                nprogress.done()
            },                
            viewTicket(ticketId) {
                this.$router.push('/ticket/' + ticketId)
            },
            updateRowNumbers() {
                let rowNumber = 1
                this.tickets.forEach(ticket => {
                    ticket.rowNumber = rowNumber
                    rowNumber += 1
                })
            }
        },
        created() {
            if (this.$store.getters.role === 'user') {
                this.getUserTickets()
            } else {
                this.getTicketsFilteredByRole()
                this.$store.commit('updateAdminView', {
                    adminView: 'pending'
                })
            }
            
        }
    }
</script>

<style scoped>
    .pending{
        width: 900px;
    }
    .pending__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .pending__wrapper {
        border: 1px solid var(--neutral-700);
        border-radius: 2px;
        display: flex;
        align-items: center;
        height: 33px;
        width: 10rem;
        padding: 0.3rem;
        background-color: white;
    }
    .pending__clear {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }
    .pending__title {
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
    .pending__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .pending__column-headers {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 1rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 0.5fr 1fr 1fr 2fr 1.5fr 1fr;
    }
    .pending__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .pending__row:nth-child(even) {
        background-color: var(--neutral-100);
    }
</style>