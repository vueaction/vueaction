import { BeforeRunCallback } from './Callbacks'
import {
  OnSuccessCallback,
  OnErrorCallback,
  OnStandardErrorCallback,
  OnValidationErrorCallback,
  OnFinallyCallback,
} from './Callbacks'
import { UseActionConfigBase } from './UseAction'

export interface ActionTypings {
  payload: any
  options: any
  response: any
}

export interface RunActionTypings {
  runOptions?: any
}

export interface UseActionTypings {
  useOptions?: any
}

export type AllActionTypings = ActionTypings & RunActionTypings & UseActionTypings

export interface Action<
  Typings extends AllActionTypings = AllActionTypings,
  RunActionTypings extends ActionTypings = {
    payload: Typings['payload']
    options: Typings['options'] & Typings['runOptions']
    response: Typings['response']
  },
  UseActionTypings extends ActionTypings = {
    payload: Typings['payload']
    options: Typings['options'] & Typings['useOptions']
    response: Typings['response']
  },
> {
  name: string
  namespace?: string | string[]

  setupDefaultOptions?: Partial<Typings['options']> |
  (() => Partial<Typings['options']>) |
  (() => Promise<Partial<Typings['options']>>)
  setupDefaultPayload?: Partial<Typings['payload']> |
  (() => Partial<Typings['payload']>) |
  (() => Promise<Partial<Typings['payload']>>)

  run?: {
    beforeRun?: BeforeRunCallback<RunActionTypings>
    onSuccess?: OnSuccessCallback<RunActionTypings>
    onError?: OnErrorCallback<RunActionTypings>
    onStandardError?: OnStandardErrorCallback<RunActionTypings>
    onValidationError?: OnValidationErrorCallback<RunActionTypings>
    onFinally?: OnFinallyCallback<RunActionTypings>
  }

  use?: {
    setup?: (ctx: {
      beforeRun: (callback: BeforeRunCallback<Typings>) => void
      onSuccess: (callback: OnSuccessCallback<Typings>) => void
      onError: (callback: OnErrorCallback<Typings>) => void
      onStandardError: (callback: OnStandardErrorCallback<Typings>) => void
      onValidationError: (callback: OnValidationErrorCallback<Typings>) => void
      onFinally: (callback: OnFinallyCallback<Typings>) => void
    } & UseActionConfigBase<Action, UseActionTypings>) => Record<string, any> | void
  }
}
