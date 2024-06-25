// @ts-nocheck

window.actions = {}

const javascriptDriver = createJavascript({
  name: 'javascript',
  mockLatencyMs: 400,
  actions: window.actions,
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
