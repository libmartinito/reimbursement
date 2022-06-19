<template>
    <section class="home">
        <div class="home__header">Welcome.</div>
        <div class="home__subheader">Here's what you can do.</div>
        <div v-if="this.$store.getters.role === 'user'" class="home__copy">
            <div><strong>Pending tickets</strong> - See a list of all your remaining tickets as well as its current status.</div>
            <div><strong>Completed tickets</strong> - See a list of all the tickets that had been approved/rejected.</div>
            <div><strong>Create ticket</strong> - Create a ticket to be reviewed by the Director, HSU, HR, SDAS, and Finance.</div>
        </div>
        <div v-else class="home__copy">
            <form @submit.prevent="searchTicket">
                <div class="home__search">
                    <input type="text" placeholder="Search for a ticket." v-model="searchInput"/>
                    <div @click="clearSearchInput" class="home__clear"></div>
                </div>
            </form>
            <div v-if="ticketToShow" class="home__ticket">
                <div class="ticket__header">Ticket #{{ ticketToShow.crf }}</div>
                <div>Date Filed: {{ ticketToShow.created_at.substring(0, 10) }}</div>
                <div>Approved By: {{ approvedBy }}</div>
                <div>To Approve: {{ toApprove }}</div>
                <base-progress :actionBy="ticketToShow.action_by"></base-progress>
            </div>
            <div><strong>Pending tickets</strong> - See a list of all the tickets that need your action.</div>
            <div><strong>Completed tickets</strong> - See a list of all the tickets that had moved forward.</div>
            <div><strong>Forecast</strong> - Get a view of the expected count of requests throughout the year.</div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                ticketToShow: null,
                tickets: null,
                searchInput: ""
            }
        },
        computed: {
            approvedBy() {
                const roles = ['director', 'hsu', 'hr', 'sdas', 'finance', 'none']
                const rolesTitleCase = ['Director', 'HSU', 'HR', 'SDAS', 'Finance']
                const actionByIndex = roles.indexOf(this.ticketToShow.action_by)
                const approvedByIndex = actionByIndex - 1

                if (approvedByIndex !== -1) {
                    return rolesTitleCase[approvedByIndex]
                } else {
                    return "No one yet."
                }
            },
            toApprove() {
                const roles = ['director', 'hsu', 'hr', 'sdas', 'finance', 'none']
                const rolesTitleCase = ['Director', 'HSU', 'HR', 'SDAS', 'Finance']
                const toApproveIndex = roles.indexOf(this.ticketToShow.action_by)
                if (toApproveIndex !== 5) {
                    return rolesTitleCase[toApproveIndex]
                } else {
                    return "No one. Ticket is approved by all."
                }
            }
        },
        methods: {
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
                    this.ticketToShow = this.tickets[index]
                } else {
                    return
                }      
            },
            clearSearchInput() {
                this.ticketToShow = null
                this.searchInput = null
            },
            async getAllTickets() {
                try {
                    let response = await fetch("/api/ticket", {
                        method: "GET",
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.tickets = response
                } catch(error) {
                    console.log(error)
                }
            }
        },
        created() {
            this.getAllTickets()
        }
    }
</script>

<style scoped>
    .home {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .home__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .home__subheader {
        font-size: 1.5rem;
        letter-spacing: 2px;
        padding: 0.3rem;
    }
    .home__copy div {
        font-size: 1.2rem;
        letter-spacing: 2px;
        margin: 0.8rem 0rem;
    }
    .home__copy {
        padding: 0.3rem;
    }
    .home__search {
        border: 1px solid var(--neutral-700);
        border-radius: 2px;
        display: flex;
        align-items: center;
        width: 20rem;
        padding: 0rem 0.5rem;
        background-color: white;
    }
    .home__clear {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }
    .home__ticket {
        margin: 5rem 0rem;
    }
    .ticket__header {
        font-weight: 700;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 18rem;
        border: none;
    }
    input:focus {
        outline: none;
    }
</style>