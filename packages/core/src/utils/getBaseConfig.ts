import { VueActionConfig, vueActionState } from '../plugin/state'

export function getBaseConfig(): VueActionConfig {
  return vueActionState.config ?? {}
}
