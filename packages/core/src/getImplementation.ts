import { VueActionDriverImplementation } from './contracts/VueActionDriver'
import { vueActionState } from './plugin/state'
import { toValue } from 'vue'
import { Action } from './contracts/Action'

export function getImplementation<
  T extends Action,
  K extends keyof VueActionDriverImplementation<T>,
>(
  key: K,
  driver?: string,
): VueActionDriverImplementation<T>[K] {
  let implementation: VueActionDriverImplementation<T>[K] | undefined

  if (driver) {
    implementation = vueActionState.drivers[driver]?.driver[key] as unknown as VueActionDriverImplementation<T>[K]
  }
  else if (!vueActionState.default) {
    const firstDriverKey = Object.keys(vueActionState.drivers)[0]
    if (!firstDriverKey) {
      throw new Error(`could not find implementation for "${key}". No drivers installed.`)
    }

    implementation = vueActionState.drivers[firstDriverKey].driver[key] as unknown as VueActionDriverImplementation<T>[K]
  }
  else {
    implementation = vueActionState.drivers[toValue(vueActionState.default)].driver[key] as unknown as VueActionDriverImplementation<T>[K]
  }

  if (!implementation) {
    throw new Error(`could not discover implementation for "${key}". No driver installed.`)
  }

  return implementation
}
