import { VueActionState, vueActionState } from './state'

export function createVueAction(options: VueActionState) {
  vueActionState.default = options?.default ?? 'default'
  Object.assign(vueActionState.drivers, options?.drivers ?? {})

  return {
    install: () => {
      //
    },
  }
}
