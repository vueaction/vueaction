import { VueActionConfig } from '../plugin/state'
import { getDriver } from './getDriver'

export function getRawDriverConfig(driverKey?: string): VueActionConfig {
  return getDriver(driverKey).config ?? {}
}
