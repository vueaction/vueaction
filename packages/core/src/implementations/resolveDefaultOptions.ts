import { Action } from '../contracts/Action'

export async function resolveDefaultOptions(options: Action['setupDefaultOptions']) {
  if (!options) return {}

  if (typeof options === 'object') return options
  if (typeof options === 'function') return await options()
  return {}
}
