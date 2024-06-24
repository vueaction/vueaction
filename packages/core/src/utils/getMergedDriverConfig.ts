import { VueActionConfig } from '../plugin/state'
import { getBaseConfig } from './getBaseConfig'
import { deepmerge } from 'deepmerge-ts'
import { getRawDriverConfig } from './getRawDriverConfig'

export function getMergedDriverConfig(driverKey?: string): VueActionConfig {
  const baseConfig = getBaseConfig()
  const driverConfig = getRawDriverConfig(driverKey)

  return deepmerge(baseConfig, driverConfig)
}
