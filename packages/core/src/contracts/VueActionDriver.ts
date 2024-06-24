import { VueActionConfig } from '../plugin/state'
import { RunAction } from './RunAction'
import { Action } from './Action'
import { UseAction } from './UseAction'

export interface VueActionDriverImplementation<T extends Action = Action> {
  runAction: RunAction<T>
  useAction: UseAction<T>
}

/**
 * Interface/Contract for a VueAction driver
 */
export interface VueActionDriver<T extends Action = Action> {
  config?: VueActionConfig
  driver: VueActionDriverImplementation<T>
}
