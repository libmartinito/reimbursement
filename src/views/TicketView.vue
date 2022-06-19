<template>
    <section class="ticket">
        <div class="ticket__header">
            <div class="ticket__title">Ticket CRF # {{ ticket.crf}}</div>
            <div @click="goBack" class="ticket__back">
                <div class="ticket__back-icon"></div>
                <div class="ticket__back-copy">go back</div>
            </div>
        </div>
        <div class="ticket__divider"></div>
        <div class="ticket__info">
            <div class="ticket__row">
                <div class="ticket__label">First Name</div>
                <div class="ticket__firstName">{{ userInfo.first_name }}</div>
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Last Name</div>
                <div class="ticket__lastName">{{ userInfo.last_name }}</div>
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Date</div>
                <div class="ticket__date">{{ ticket.created_at.slice(0,10) }}</div>
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Purpose</div>
                <div class="ticket__office">{{ ticket.purpose }}</div>
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Office</div>
                <div class="ticket__office">{{ ticket.office }}</div>
            </div>
        </div>
        <div class="reimbursement">
            <div class="reimbursement__header">
                <div class="reimbursement__title">Reimbursement</div>
            </div>
            <div class="reimbursement__table">
                <div class="reimbursement__column-headers">
                    <div>Row #</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Nature of Expenditure</div>
                    <div>Approve</div>
                </div>
            </div>
            <base-row            
                @updateCheckedRows="updateCheckedRows($event)"
                class="reimbursement__row" v-for="item in reimbursements"
                :key="item.rowNumber"
                :reimbursementId = "item.id"
                :rowNumber="item.rowNumber"
                :date="item.date"
                :amount="item.amount"
                :nature="item.nature"
                :checkedValue="item.checked"
                mode="ticket"
            ></base-row>
            <div class="reimbursement__total">Total Amount: {{ reimbursementTotal }}</div>
        </div>
        <div class="uploads">
            <div class="uploads__header">Uploaded Receipt/Prescription</div>
            <img :src="ticket.image_link" class="uploads__img"/>
            <div v-if="this.$store.getters.role === 'hr' && !this.isHrLink" class="uploads__header">Upload Attachment</div>
            <div v-if="this.isHrLink" class="uploads__header">Uploaded Attachment</div>
            <img v-if="this.isHrLink" :src="ticket.hr_link" class="uploads__img"/>
            <label v-if="this.$store.getters.role === 'hr' && !this.isHrLink" for="uploads__input" class="uploads__action">
                <div v-if="!this.file" class="uploads__icon"></div>
                <div v-if="!this.file">Click here to choose</div>
                <div v-else>Click here again to change</div>
                <div v-if="this.file" class="uploads__filename">{{ file.name }}</div>
                <input type="file" id="uploads__input" @change="handleImageUpload($event)"/>
            </label>
        </div>
        <div v-if="this.isUploadEmpty" class="error">No photo detected for upload. Please add.</div>
        <div class="remarks__user" v-if="this.$store.getters.role === 'user'">
            <div class="remarks__row">
                <div class="remarks__label">Director Remarks</div>
                <div class="remarks__content">{{ publicDirectorFeedback }}</div>
            </div>
            <div class="remarks__row">
                <div class="remarks__label">HSU Remarks</div>
                <div class="remarks__content">{{ publicHSUFeedback }}</div>
            </div>
            <div class="remarks__row">
                <div class="remarks__label">HR Remarks</div>
                <div class="remarks__content">{{ publicHRFeedback }}</div>
            </div>
            <div class="remarks__row">
                <div class="remarks__label">SDAS Remarks</div>
                <div class="remarks__content">{{ publicSDASFeedback }}</div>
            </div>
            <div class="remarks__row">
                <div class="remarks__label">Finance Remarks</div>
                <div class="remarks__content">{{ publicFinanceFeedback }}</div>
            </div>
        </div>
        <div class="remarks__other" v-if="this.$store.getters.adminView === 'pending'">
            <div class="remarks__public">
                <div class="remarks__row">
                    <div class="remarks__label">Director Remarks</div>
                    <textarea class="remarks__input" v-model="publicRemarksInput" v-if="this.$store.getters.role === 'director'" required></textarea>
                    <div class="remarks__content" v-else>{{ publicDirectorFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HSU Remarks</div>
                    <textarea class="remarks__input" v-model="publicRemarksInput" v-if="this.$store.getters.role === 'hsu'" required></textarea>
                    <div class="remarks__content" v-else>{{ publicHSUFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HR Remarks</div>
                    <textarea class="remarks__input" v-model="publicRemarksInput" v-if="this.$store.getters.role === 'hr'" required></textarea>
                    <div class="remarks__content" v-else>{{ publicHRFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">SDAS Remarks</div>
                    <textarea class="remarks__input" v-model="publicRemarksInput" v-if="this.$store.getters.role === 'sdas'" required></textarea>
                    <div class="remarks__content" v-else>{{ publicSDASFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">Finance Remarks</div>
                    <textarea class="remarks__input" v-model="publicRemarksInput" v-if="this.$store.getters.role === 'finance'" required></textarea>
                    <div class="remarks__content" v-else>{{ publicFinanceFeedback }}</div>
                </div>
            </div>            
            <div class="remarks__private">
                <div class="remarks__row">
                    <div class="remarks__label">Director Internal Comments</div>
                    <textarea class="remarks__input" v-model="privateRemarksInput" v-if="this.$store.getters.role === 'director'" required></textarea>
                    <div class="remarks__content" v-else>{{ privateDirectorFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HSU Internal Comments</div>
                    <textarea class="remarks__input" v-model="privateRemarksInput" v-if="this.$store.getters.role === 'hsu'" required></textarea>
                    <div class="remarks__content" v-else>{{ privateHSUFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HR Internal Comments</div>
                    <textarea class="remarks__input" v-model="privateRemarksInput" v-if="this.$store.getters.role === 'hr'" required></textarea>
                    <div class="remarks__content" v-else>{{ privateHRFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">SDAS Internal Comments</div>
                    <textarea class="remarks__input" v-model="privateRemarksInput" v-if="this.$store.getters.role === 'sdas'" required></textarea>
                    <div class="remarks__content" v-else>{{ privateSDASFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">Finance Internal Comments</div>
                    <textarea class="remarks__input" v-model="privateRemarksInput" v-if="this.$store.getters.role === 'finance'" required></textarea>
                    <div class="remarks__content" v-else>{{ privateFinanceFeedback }}</div>
                </div>
            </div>            
        </div>
        <div class="remarks__other" v-if="this.$store.getters.adminView === 'completed'">
            <div class="remarks__public">
                <div class="remarks__row">
                    <div class="remarks__label">Director Remarks</div>
                    <div class="remarks__content">{{ publicDirectorFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HSU Remarks</div>
                    <div class="remarks__content">{{ publicHSUFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HR Remarks</div>
                    <div class="remarks__content">{{ publicHRFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">SDAS Remarks</div>
                    <div class="remarks__content">{{ publicSDASFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">Finance Remarks</div>
                    <div class="remarks__content">{{ publicFinanceFeedback }}</div>
                </div>
            </div>            
            <div class="remarks__private">
                <div class="remarks__row">
                    <div class="remarks__label">Director Internal Comments</div>
                    <div class="remarks__content">{{ privateDirectorFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HSU Internal Comments</div>
                    <div class="remarks__content">{{ privateHSUFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">HR Internal Comments</div>
                    <div class="remarks__content">{{ privateHRFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">SDAS Internal Comments</div>
                    <div class="remarks__content">{{ privateSDASFeedback }}</div>
                </div>
                <div class="remarks__row">
                    <div class="remarks__label">Finance Internal Comments</div>
                    <div class="remarks__content">{{ privateFinanceFeedback }}</div>
                </div>
            </div>            
        </div>
        <div v-if="isInputBlank" class="error">Remarks and internal comments cannot be empty. Please update.</div>
        <base-button v-if="isSaveShown" @click="saveTicketChanges" mode="dark">Save</base-button>
    </section>
</template>

<script>
import nprogress from 'nprogress'

    export default {
        props: ["ticketId"],
        data() {
            return {
                ticket: null,
                reimbursements: null,
                reimbursementTotal: 0,
                publicFeedback: null,
                privateFeedback: null,
                publicRemarksInput: "",
                privateRemarksInput: "",
                isInputBlank: false,
                userInfo: null,
                checkedRows: null,
                file: null,
                isUploadEmpty: null,
                isHrLink: null
            }
        },
        computed: {
            isSaveShown() {
                if (this.$store.getters.role === 'user') {
                    return false
                } else if (this.$store.getters.adminView === 'completed') {
                    return false
                } else {
                    return true
                }
            },
            publicDirectorFeedback() {
                if (this.publicFeedback) {
                    if (this.publicFeedback.director) {
                        return this.publicFeedback.director
                    }
                }
                return "No feedback available."
            },
            publicHSUFeedback() {
                if (this.publicFeedback) {
                    if (this.publicFeedback.hsu) {
                        return this.publicFeedback.hsu
                    }
                }
                return "No feedback available."
            },
            publicHRFeedback() {
                if (this.publicFeedback) {
                    if (this.publicFeedback.hr) {
                        return this.publicFeedback.hr
                    }
                }
                return "No feedback available."
            },
            publicSDASFeedback() {
                if (this.publicFeedback) {
                    if (this.publicFeedback.sdas) {
                        return this.publicFeedback.sdas
                    }
                }
                return "No feedback available."
            },
            publicFinanceFeedback() {
                if (this.publicFeedback) {
                    if (this.publicFeedback.finance) {
                        return this.publicFeedback.finance
                    }
                }
                return "No feedback available."
            },
            privateDirectorFeedback() {
                if (this.privateFeedback) {
                    if (this.privateFeedback.director) {
                        return this.privateFeedback.director
                    }
                }
                return "No feedback available."
            },
            privateHSUFeedback() {
                if (this.privateFeedback) {
                    if (this.privateFeedback.hsu) {
                        return this.privateFeedback.hsu
                    }
                }
                return "No feedback available."
            },
            privateHRFeedback() {
                if (this.privateFeedback) {
                    if (this.privateFeedback.hr) {
                        return this.privateFeedback.hr
                    }
                }
                return "No feedback available."
            },
            privateSDASFeedback() {
                if (this.privateFeedback) {
                    if (this.privateFeedback.sdas) {
                        return this.privateFeedback.sdas
                    }
                }
                return "No feedback available."
            },
            privateFinanceFeedback() {
                if (this.privateFeedback) {
                    if (this.privateFeedback.finance) {
                        return this.privateFeedback.finance
                    }
                }
                return "No feedback available."
            },
        },
        methods: {
            async getTicket() {
                try {
                    const url = "/api/ticket/" + this.ticketId
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.ticket = response[0]                    
                } catch(error) {
                    console.log(error)
                }
            },
            getCheckedRows() {
                const checkedRows = []
                this.reimbursements.forEach(item => {
                    if (item.checked === 1) {
                        checkedRows.push(item.id)
                    }
                })
                this.checkedRows = checkedRows
            },
            handleImageUpload(e) {
                this.file = e.target.files[0]
            },
            async getReimbursements() {
                try {
                    const url = "/api/reimbursement/" + this.ticketId
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.reimbursements = response
                    this.updateRowNumbers()
                    this.updateReimbursementTotal()
                    this.getCheckedRows()
                } catch(error) {
                    console.log(error)
                }
            },
            updateIsUploadEmpty() {
                if (!this.file) {
                    this.isUploadEmpty = true
                } else {
                    this.isUploadEmpty = false
                }
            },
            async uploadImage() {
                try {
                    const fd = new FormData()
                    fd.append('file', this.file, this.file.name)
                    await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                        },
                        body: fd
                    })
                    console.log(this.file)
                } catch(error) {
                    console.log(error)
                }     
            },
            async getUserInfo() {
                try {
                    await this.getTicket()
                    const url = "/api/user/" + this.ticket.user_id
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.userInfo = response[0]
                } catch(error) {
                    console.log(error)
                }
            },
            async getPublicRemarks() {
                try {
                    const url = "/api/remarks/public/ticket/" + this.ticketId
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()

                    if (response.code) {
                        console.log(this.userInfo)
                        return
                    } else {
                        const remarks = {}
                        response.forEach(remark => {
                            const role = remark.role
                            remarks[role] = remark.content
                        })
                        this.publicFeedback = remarks
                    }
                } catch(error) {
                    console.log(error)
                }
            },
            async getPrivateRemarks() {
                try {
                    const url = "/api/remarks/private/ticket/" + this.ticketId
                    let response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()

                    if (response.code) {
                        console.log(this.userInfo)
                        return
                    } else {
                        const remarks = {}
                        response.forEach(remark => {
                            const role = remark.role
                            remarks[role] = remark.content
                        })
                        this.privateFeedback = remarks
                    }
                    console.log(this.userInfo)
                } catch(error) {
                    console.log(error)
                }
            },
            updateRowNumbers() {
                let rowNumber = 1
                this.reimbursements.forEach(item => {
                    item.rowNumber = rowNumber
                    rowNumber += 1
                })
            },
            updateIsInputBlank() {
                if (this.publicRemarksInput === "" || this.privateRemarksInput === "") {
                    this.isInputBlank = true
                } else {
                    this.isInputBlank = false
                }
            },
            updateReimbursementTotal() {
                const amountArr = []
                this.reimbursements.forEach(item => {
                    amountArr.push(item.amount)
                })
                const total = amountArr.reduce((a, b) => a + b, 0)
                this.reimbursementTotal = total
            },
            updateIsHrLink() {
                if (this.ticket.hr_link) {
                    this.isHrLink = true
                }
            },
            async updateRemark(type) {
                let content = ""
                if (type === 'public') {
                    content = this.publicRemarksInput
                } else {
                    content = this.privateRemarksInput
                }
                try {
                    await fetch("/api/remarks", {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ticketId: this.ticketId,
                            type: type,
                            role: this.$store.getters.role,
                            content: content
                        })
                    })
                } catch(error) {
                    console.log(error)
                }
            },
            async updateReimbursement() {
                const reimbursementIds = []
                this.reimbursements.forEach(reimbursement => {
                    reimbursementIds.push(reimbursement.id)
                })
                for (let i = 0; i < reimbursementIds.length; i++) {
                    if (this.checkedRows.includes(reimbursementIds[i])) {
                        try {
                            const url = "/api/reimbursement/" + reimbursementIds[i]
                            await fetch(url, {
                                method: 'PATCH',
                                mode: 'cors',
                                headers: {
                                    'Authorization': 'Bearer ' + this.$store.getters.token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    checked: true
                                })
                            })
                        } catch(error) {
                            console.log(error)
                        }
                    } else {
                        try {
                            const url = "/api/reimbursement/" + reimbursementIds[i]
                            await fetch(url, {
                                method: 'PATCH',
                                mode: 'cors',
                                headers: {
                                    'Authorization': 'Bearer ' + this.$store.getters.token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    checked: false
                                })
                            })
                        } catch(error) {
                            console.log(error)
                        }
                    }                    
                }
            },
            async updateTicket() {
                const roles = ['director', 'hsu', 'hr', 'sdas', 'finance']
                let updatedActionBy = ""
                let currentRoleIndex = roles.indexOf(this.$store.getters.role)
                
                if (this.checkedRows.length === 0) {
                    updatedActionBy = 'none'
                } else {
                    if (this.$store.getters.role === "finance") {
                        updatedActionBy = 'none'
                    } else {
                        updatedActionBy = roles[currentRoleIndex + 1]
                    }
                }

                let status = ""
                if (this.checkedRows.length === 0) {
                    status = 'Rejected'
                } else {
                    if (updatedActionBy === 'none') {
                        status = 'Completed'
                    } else if (updatedActionBy === 'hsu') {
                        status = 'Director Approved'
                    }
                    else if (updatedActionBy === 'hr') {
                        status = 'HSU Approved'
                    }
                    else if (updatedActionBy === 'sdas') {
                        status = 'HR Approved'
                    }
                    else if (updatedActionBy === 'finance') {
                        status = 'SDAS Approved'
                    }
                }    

                try {
                    const url = "/api/ticket/" + this.ticketId
                    await fetch(url,  {
                        method: 'PATCH',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            actionBy: updatedActionBy,
                            status: status
                        })
                    })
                } catch(error) {
                    console.log(error)
                }                

                if (this.$store.getters.role === 'hr') {
                    try {
                        const url = "/api/ticket/" + this.ticketId + "/hr"
                        await fetch(url, {
                            method: 'PATCH',
                            mode: 'cors',
                            headers: {
                                'Authorization': 'Bearer ' + this.$store.getters.token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                hrLink: '/uploads/' + this.file.name,
                            })
                        })
                    } catch(error) {
                        console.log(error)
                    }
                }
                
            },
            async saveTicketChanges() {
                if (this.publicRemarksInput === "" || this.privateRemarksInput === "") {
                    this.updateIsInputBlank()
                    return
                } else if (this.$store.getters.role === 'hr' && !this.file) {
                    this.updateIsUploadEmpty()
                    return
                } else {
                    nprogress.start()
                    await this.updateRemark('public')
                    await this.updateRemark('private')
                    await this.updateReimbursement()
                    await this.updateTicket()

                    if (this.file) {
                        await this.uploadImage()
                    }
                    nprogress.done()
                    this.$router.push('/pending')
                }        

            },
            async getInfoNeeded() {
                nprogress.start()
                await this.getUserInfo()
                await this.getReimbursements()
                await this.getPublicRemarks()
                await this.getPrivateRemarks()
                this.updateIsHrLink()
                nprogress.done()
            },
            updateCheckedRows(reimbursementId) {
                console.log(this.checkedRows)
                let checkedRowsArr = this.checkedRows
                if (checkedRowsArr.indexOf(reimbursementId) >= 0) {
                    const indexToRemove = checkedRowsArr.indexOf(reimbursementId)
                    checkedRowsArr.splice(indexToRemove, 1)
                    console.log(this.checkedRows)
                } else {
                    checkedRowsArr.push(reimbursementId)
                    this.checkedRows = checkedRowsArr
                    console.log(this.checkedRows)
                }
            },
            goBack() {
                this.$router.go(-1)
            }
        },
        created() {
            this.getInfoNeeded()
        }
    }
</script>

<style scoped>
    .ticket {
        width: 900px;
    }
    .ticket__header {
        display: flex;
        justify-content: space-between;
    }
    .ticket__title {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .ticket__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .ticket__back-icon {
        background-image: url('../assets/back.svg');
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
    }
    .ticket__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .ticket__info {
        margin: 3rem 0rem;
    }
    .ticket__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .ticket__label {
        font-weight: 700;
        width: 8rem;
    }
    .reimbursement__header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .reimbursement__title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .reimbursement__column-headers {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 1rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
    }
    .reimbursement__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .reimbursement__row:nth-child(odd) {
        background-color: var(--neutral-100);
    }
    .reimbursement__total {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 2rem 0rem;
    }
    .uplaods__header {
        font-size: 1.2rem;
        font-weight: 700;
    }
    #uploads__input {
        display: none;
    }
    .uploads__icon {
        background-image: url('../assets/plus.svg');
        background-size: contain;
        width: 2rem;
        height: 2rem;
        margin: 2rem;
    }
    .uploads__action {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px dashed var(--neutral-700);
        width: fit-content;
        padding: 2rem;
        margin: 2rem 0rem;
        cursor: pointer;
    }
    .uploads__img {
        max-width: 900px;
        margin: 2rem 0rem;
    }
    .remarks__other {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin: 1rem 0rem;
    }
    .remarks__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .remarks__label {
        font-weight: 700;
        width: 10rem;
    }
    textarea {
        font: inherit;
        padding: 0.2rem;
        width: 30rem;
        height: 5rem;
        resize: none;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
        margin: 2rem 0rem;
    }
</style>