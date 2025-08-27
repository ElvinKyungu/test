import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'
import router from './routes/router'
import { createPinia } from 'pinia'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(pinia)
app.use(VueSweetalert2)
app.mount('#app')

