import { createVueAction, vueActionState } from '@vueaction/core'
import { createApp } from 'vue'
import { implementationSetupsMap } from './implementations/implementationSetupsMap'

const setups = implementationSetupsMap[import.meta.env.IMPLEMENTATION ?? 'javascript']

export async function baseSetup(ctx) {
  const app = createApp({})

  await setups.baseSetup(app, ctx)

  const vueAction = createVueAction({
    default: 'javascript',
    drivers: {
      javascript: {
        driver: setups.implementation,
        config: { },
      },
    },
  })

  vueActionState.config = {}
  vueActionState.drivers.javascript.config = {}

  app.use(vueAction)
}
