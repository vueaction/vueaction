import { toValue } from 'vue'
import { vueActionState } from '../plugin/state'

export function getDriver(driverKeyParam?: string) {
  const driverKey = driverKeyParam ?? vueActionState.default ?? 'default'

  const driver = vueActionState.drivers[toValue(driverKey)]

  if (!driver) {
    throw new Error(`driver "${driverKey}" not found`)
  }

  return driver
}
