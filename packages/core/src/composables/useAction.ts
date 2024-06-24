import { UseAction, UseActionConfigParam, UseActionReturn } from '../contracts/UseAction'
import { Action as ActionType } from '../contracts/Action'
import { getImplementation } from '../getImplementation'
import { resolveParams } from './resolveParams'

export function useAction<T extends ActionType>(
  Action: T | string,
  config?: UseActionConfigParam<T> | T,
  hasDriverOptions?: UseActionConfigParam<T>,
): UseActionReturn<T> {
  const params = resolveParams<T, UseActionConfigParam<T>>(Action, config, hasDriverOptions)
  const implementation = getImplementation('useAction', params.driver) as UseAction<T>

  return implementation(params.Action, params.options)
}
