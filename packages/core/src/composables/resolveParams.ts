import { toValue } from 'vue'
import { Action as ActionType } from '../contracts/Action'
import { vueActionState } from '../plugin/state'

export function resolveParams<T extends ActionType, O extends { driver?: string }>(
  actionOrDriver: T | string,
  optionsOrAction?: O | T,
  driverOptions?: O,
): { Action: T, options: O, driver: string } {
  if (typeof actionOrDriver === 'string') {
    return {
      driver: actionOrDriver,
      Action: optionsOrAction as T,
      options: driverOptions as O,
    }
  }

  return {
    Action: actionOrDriver,
    options: optionsOrAction as O,
    driver: (optionsOrAction as O)?.driver ?? toValue(vueActionState?.default) ?? 'default',
  }
}
