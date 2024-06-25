// @ts-nocheck

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
  default: 'javascript',
  drivers: {
    javascript: {
      driver: javascriptVueActionDriver,
    },
  },
})

app.use(vueAction)
app.use(javascriptDriver)
