import { VueActionConfig } from '../plugin/state'
import { getBaseConfig } from './getBaseConfig'
import { getRawDriverConfig } from './getRawDriverConfig'

export function getMergedDriverConfig(driverKey?: string): VueActionConfig {
  const baseConfig = getBaseConfig()
  const driverConfig = getRawDriverConfig(driverKey)

  return Object.assign({}, baseConfig, driverConfig)
}
