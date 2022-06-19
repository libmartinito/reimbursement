import { createApp } from "vue"
import App from "./App.vue";
import router from "./router"

import BaseButton from './components/BaseButton.vue'
import BaseModal from './components/BaseModal.vue'
import BaseRow from './components/BaseRow.vue'
import BaseToggle from './components/BaseToggle.vue'
import BaseProgress from './components/BaseProgress.vue'

import store from './store'

const app = createApp(App);

app.use(store)
app.use(router)

app.component('BaseButton', BaseButton)
app.component('BaseModal', BaseModal)
app.component('BaseRow', BaseRow)
app.component('BaseToggle', BaseToggle)
app.component('BaseProgress', BaseProgress)

app.mount("#app")
