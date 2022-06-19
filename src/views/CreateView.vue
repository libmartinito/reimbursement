<template>
    <section class="create">
        <div class="create__header">Create Ticket</div>
        <div class="create__divider"></div>
        <div class="ticket__info">
            <div class="ticket__row">
                <div class="ticket__label">Date</div>
                <div class="ticket__date">{{ currentDate }}</div>
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Purpose</div>
                <input type="text" v-model="purpose" required />
            </div>
            <div class="ticket__row">
                <div class="ticket__label">Office</div>
                <select class="ticket__office" v-model="office">
                    <option value="">-- Please choose an office --</option>
                    <option value="FEU Tech">FEU Tech</option>
                    <option value="FEU Diliman">FEU Diliman</option>
                    <option value="FEU Makati">FEU Makati</option>
                    <option value="FEU Cavite">FEU Cavite</option>
                    <option value="FEU High School">FEU High School</option>
                    <option value="FEU Alabang">FEU Alabang</option>
                    <option value="FEU Roosevelt">FEU Roosevelt</option>
                </select>
            </div>
            <div v-if="isOfficeEmpty" class="error">Please choose an office.</div>
        </div>
        <div class="reimbursement">
            <div class="reimbursement__header">
                <div class="reimbursement__title">Reimbursement</div>
                <base-button @click="updateIsReimbursementModalDisplayed" mode="dark">Add Reimbursement</base-button>
            </div>
            <div class="reimbursement__table">
                <div class="reimbursement__column-headers">
                    <div>Row #</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Nature of Expenditure</div>
                    <div>Actions</div>
                </div>
            </div>
            <base-row 
                @deleteRow="deleteReimbursement($event)" 
                @editRow="editReimbursement($event)" 
                class="reimbursement__row" v-for="item in reimbursements"
                :key="item.rowNumber"
                :rowNumber="item.rowNumber"
                :date="item.date"
                :amount="item.amount"
                :nature="item.nature"
                mode="create"
            ></base-row>
            <div class="reimbursement__total">Total Amount: {{ reimbursementTotal }}</div>
            <div v-if="isTotalBelowMinimum" class="error">Total should be 500 at minimum. Please add reimbursement item.</div>
        </div>
        <div class="uploads">
            <div class="uploads__header">Upload Receipt/Prescription</div>
            <label for="uploads__input" class="uploads__action">
                <div v-if="!this.file" class="uploads__icon"></div>
                <div v-if="!this.file">Click here to choose</div>
                <div v-else>Click here again to change</div>
                <div v-if="this.file" class="uploads__filename">{{ file.name }}</div>
                <input type="file" id="uploads__input" @change="handleImageUpload($event)"/>                
            </label>            
        </div>
        <div v-if="isUploadEmpty" class="error">No photo detected for upload. Please add.</div>
        <base-button @click="createTicket" mode="dark">Create</base-button>
    </section>
    <Teleport to="#app">
        <base-modal v-if="isReimbursementModalDisplayed">
            <div class="modal__header">
                <div v-if="addOrUpdate === 'add'" class="modal__title">New Reimbursement</div>
                <div v-if="addOrUpdate === 'update'" class="modal__title">Update Reimbursement</div>
                <div @click="closeModal" class="modal__close"></div>                
            </div>
            <div class="modal__divider"></div>
            <div class="modal__input">
                <div class="modal__label">Date</div>
                <input type="date" v-model="reimbursementDate" />
            </div>
            <div class="modal__input">
                <div class="modal__label">Amount</div>
                <input type="number" v-model="reimbursementAmount" />
            </div>
            <div class="modal__input">
                <div class="modal__label">Nature of Expenditure</div>
                <input type="text" v-model="reimbursementNature" />
            </div>
            <base-button v-if="addOrUpdate === 'add'" @click="addReimbursement" mode="dark" class="modal__add">Add</base-button>
            <base-button v-if="addOrUpdate === 'update'" @click="updateReimbursement" mode="dark" class="modal__add">Update</base-button>
        </base-modal>
    </Teleport>
</template>

<script>
import nprogress from 'nprogress'

    export default {
        data() {
            return {
                purpose: "",
                office: "",
                reimbursements: [],
                isReimbursementModalDisplayed: false,
                reimbursementDate: null,
                reimbursementAmount: null,
                reimbursementNature: null,
                reimbursementTotal: 0,
                indexToUpdate: 0,
                addOrUpdate: "add",
                file: null,
                isOfficeEmpty: false,
                isTotalBelowMinimum: false,
                isUploadEmpty: false
            }
        },
        computed: {
            currentDate() {
                const today = new Date().toISOString()
                return today.slice(0,10)
            },
        },
        methods: {
            updateIsReimbursementModalDisplayed() {
                this.isReimbursementModalDisplayed = !this.isReimbursementModalDisplayed
            },
            updateIsOfficeNotEmpty() {
                if (this.office === "") {
                    this.isOfficeEmpty = true
                } else {
                    this.isOfficeEmpty = false
                }
            },
            updateIsTotalBelowMinimum() {
                if (this.reimbursementTotal < 500) {
                    this.isTotalBelowMinimum = true
                } else {
                    this.isTotalBelowMinimum = false
                }
            },
            updateIsUploadEmpty() {
                if (!this.file) {
                    this.isUploadEmpty = true
                } else {
                    this.isUploadEmpty = false
                }
            },
            updateRowNumbers() {
                let rowNumber = 1
                this.reimbursements.forEach(item => {
                    item.rowNumber = rowNumber
                    rowNumber += 1
                })
            },
            updateReimbursementTotal() {
                const amountArr = []
                this.reimbursements.forEach(item => {
                    amountArr.push(item.amount)
                })
                const total = amountArr.reduce((a, b) => a + b, 0)
                this.reimbursementTotal = total
            },
            closeModal() {
                this.updateIsReimbursementModalDisplayed()
                this.addOrUpdate = "add"

                this.reimbursementDate = null,
                this.reimbursementAmount = null,
                this.reimbursementNature = null
            },  
            addReimbursement() {
                const reimbursementItem = {
                    date: this.reimbursementDate,
                    amount: this.reimbursementAmount,
                    nature: this.reimbursementNature
                }

                this.reimbursements.push(reimbursementItem)

                this.updateIsReimbursementModalDisplayed()
                this.updateRowNumbers()
                this.updateReimbursementTotal()

                this.reimbursementDate = null,
                this.reimbursementAmount = null,
                this.reimbursementNature = null
            },
            updateReimbursement() {
                const updatedItem = {
                    date: this.reimbursementDate,
                    amount: this.reimbursementAmount,
                    nature: this.reimbursementNature
                }

                const index = this.indexToUpdate
                this.reimbursements[index] = updatedItem

                this.updateIsReimbursementModalDisplayed()
                this.updateRowNumbers()
                this.updateReimbursementTotal()

                this.addOrUpdate = "add"

                this.reimbursementDate = null,
                this.reimbursementAmount = null,
                this.reimbursementNature = null
            },
            editReimbursement(index) {
                const itemToEdit = this.reimbursements[index - 1]

                this.inidexToUpdate = index - 1

                this.reimbursementDate = itemToEdit.date
                this.reimbursementAmount = itemToEdit.amount
                this.reimbursementNature = itemToEdit.nature

                this.addOrUpdate = "update"
                this.updateIsReimbursementModalDisplayed()
            },
            deleteReimbursement(index) {
                this.reimbursements.splice(index - 1, 1)
                this.updateRowNumbers()
                this.updateReimbursementTotal()
            },
            handleImageUpload(e) {
                this.file = e.target.files[0]
            },
            async uploadImage() {
                try {
                    const fd = new FormData()
                    fd.append('file', this.file, this.file.name)
                    await fetch('http://localhost:3333/api/upload', {
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
            async getCrf() {
                try {
                    let response = await fetch("http://localhost:3333/api/ticketcrf", {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    return response
                } catch(error) {
                    console.log(error)
                }
            },
            async createTicket() {
                nprogress.start()
                if (this.office === "") {
                    this.updateIsOfficeNotEmpty()
                    nprogress.done()
                    return
                }
                if (this.reimbursementTotal < 500) {
                    this.updateIsTotalBelowMinimum()
                    nprogress.done()
                    return
                }
                if (!this.file) {
                    this.updateIsUploadEmpty()
                    nprogress.done()
                    return
                }
                try {
                    let crfInfo = await this.getCrf()
                    let crf = null
                    if (crfInfo) {
                        crf = crfInfo.crf + 1
                    } else {
                        crf = 1000
                    }

                    let response = await fetch("http://localhost:3333/api/ticket", {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            crf: crf,
                            userId: this.$store.getters.userId,
                            purpose: this.purpose,
                            office: this.office,
                            imageLink: 'http://localhost:3333/uploads/' + this.file.name,
                            hrLink: null,
                            actionBy: 'director',
                            status: 'Pending Director Action'
                        })
                    })

                    response = await response.json()
                    for (let i = 0; i < this.reimbursements.length; i++) {
                        await fetch("http://localhost:3333/api/reimbursement", {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Authorization': 'Bearer ' + this.$store.getters.token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ticketId: response.id,
                                date: this.reimbursements[i].date,
                                amount: this.reimbursements[i].amount,
                                nature: this.reimbursements[i].nature,
                                checked: false
                            })
                        })
                    }
                    
                    await this.uploadImage()
                    nprogress.done()
                    this.$router.push('/pending')
                } catch(error) {
                    console.log(error)
                }
            }
        },
    }
</script>

<style scoped>
    .create{
        width: 900px;
    }
    .create__header {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .create__divider,
    .modal__divider {
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
        width: 6rem;
    }
    .ticket__office {
        font: inherit;
        padding: 0.2rem;
        background-color: white;
        
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 24rem;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        appearance: none;
    }
    .reimbursement__header {
        display: flex;
        justify-content: space-between;
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
        grid-template-columns: 1fr 1fr 1fr 2fr 2fr;
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
    .uploads__header {
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
    .modal__header {
        display: flex;
        justify-content: space-between;
        margin: 0.8rem 0rem;
    }
    .modal__title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .modal__close {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
    }
    .modal__input {
        padding-top: 0.8rem;
    }
    .modal__label {
        font-size: 1.2rem;
        font-weight: 700;
    }
    .modal__add {
        margin-top: 2rem;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>