import { toValue } from 'vue'
import { vueActionState } from '../plugin/state'

export function getDriverKey(driverKeyParam?: string) {
  return toValue(driverKeyParam ?? vueActionState.default ?? 'default')
}
