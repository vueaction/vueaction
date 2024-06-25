import { createApp } from 'vue'
import App from './App.vue'
import { createVueAction, vueActionState } from '@vueaction/core'
import { javascriptVueActionDriver, createJavascript } from '@vueaction/javascript'

const app = createApp(App)

const javascriptDriver = createJavascript({
  name: 'javascript',
  mockLatencyMs: 400,
  actions: {
    'change-password'() {
      console.log('changing...')
    },
  },
})

const vueAction = createVueAction({
  default: 'default',
  drivers: {
    default: {
      driver: javascriptVueActionDriver,
    },
  },
})
app.use(vueAction)
app.use(javascriptDriver)

console.log(vueActionState)

app.mount('#app')
