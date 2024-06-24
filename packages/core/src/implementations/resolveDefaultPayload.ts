import { Action } from '../contracts/Action'

export async function resolveDefaultPayload(options: Action['setupDefaultPayload']) {
  if (!options) return {}

  if (typeof options === 'object') return options
  if (typeof options === 'function') return await options()
  return {}
}
