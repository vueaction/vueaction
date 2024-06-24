import { ExtractRunActionTypings } from '../types/ExtractActionTypings'
import { Action as ActionType } from './Action'
import { AllCallbacks } from './Callbacks'
import { Response } from './Response'

export interface RunActionConfig<
T extends ActionType = ActionType,
Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
> extends Partial<AllCallbacks> {
  payload?: Typings['payload']
  options?: Typings['options']
  driver?: string
}

export type RunAction<
  T extends ActionType = ActionType,
  Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
> = (
  Action: T,
  config?: RunActionConfig<T>
) => Promise<Response<Typings['response'], T>>
