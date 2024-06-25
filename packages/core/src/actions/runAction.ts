import { RunAction, RunActionConfig } from '../contracts/RunAction'
import { getImplementation } from '../getImplementation'
import { resolveParams } from './resolveParams'
import { Action as ActionType } from '../contracts/Action'
import { ExtractRunActionTypings } from '../types/ExtractActionTypings'
import { Response } from '../contracts/Response'
import { vueActionState } from '../plugin/state'
import { BeforeRunCallback, OnErrorCallback, OnFinallyCallback, OnStandardErrorCallback, OnSuccessCallback, OnValidationErrorCallback } from '../contracts/Callbacks'
import { getDriverKey } from '../utils/getDriverKey'

export type CallbackKind = 'beforeRun' |
  'onSuccess' |
  'onStandardError' |
  'onError' |
  'onValidationError' |
  'onFinally'

type AnyStandardFunction = ((...args: any[]) => any)
type AnyAsyncFunction = ((...args: any[]) => Promise<any>)
type AnyFunction = AnyStandardFunction | AnyAsyncFunction

function createGlobalCallbacksArray(
  callbackKind: CallbackKind,
  driver: string,
  additionalCallbacks?: AnyFunction[],
) {
  const callbacks: AnyFunction[] = []
  if (vueActionState.drivers?.[driver]?.config?.[callbackKind]) {
    callbacks.push(vueActionState.drivers[driver].config![callbackKind]!)
  }
  if (vueActionState.config?.[callbackKind]) {
    callbacks.push(vueActionState.config[callbackKind]!)
  }

  if (additionalCallbacks) callbacks.push(...additionalCallbacks)

  return callbacks
}

function filterOutUndefinedFunctions(arr: (AnyFunction | undefined)[]): AnyFunction[] {
  return arr.filter(val => val !== undefined) as AnyFunction[]
}

function makeCallbackArrays(driver: string, Action: ActionType, config: RunActionConfig = {}): {
  beforeRun: BeforeRunCallback[]
  onSuccess: OnSuccessCallback[]
  onStandardError: OnStandardErrorCallback[]
  onError: OnErrorCallback[]
  onValidationError: OnValidationErrorCallback[]
  onFinally: OnFinallyCallback[]
} {
  return {
    beforeRun: createGlobalCallbacksArray('beforeRun', driver, filterOutUndefinedFunctions([config?.beforeRun, Action.run?.beforeRun])),
    onSuccess: createGlobalCallbacksArray('onSuccess', driver, filterOutUndefinedFunctions([config?.onSuccess, Action.run?.onSuccess])),
    onStandardError: createGlobalCallbacksArray('onStandardError', driver, filterOutUndefinedFunctions([config?.onStandardError, Action.run?.onStandardError])),
    onError: createGlobalCallbacksArray('onError', driver, filterOutUndefinedFunctions([config?.onError, Action.run?.onError])),
    onValidationError: createGlobalCallbacksArray('onValidationError', driver, filterOutUndefinedFunctions([config?.onValidationError, Action.run?.onValidationError])),
    onFinally: createGlobalCallbacksArray('onFinally', driver, filterOutUndefinedFunctions([config?.onFinally, Action.run?.onFinally])),
  }
}

async function runCallbacks(callbacks: AnyFunction[], args: any[]) {
  const promises: Promise<void>[] = []
  for (const callback of callbacks) {
    promises.push(callback(...args))
  }
  await Promise.all(promises)
}

export async function runAction<
  T extends ActionType,
  Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
>(
  Action: T,
  config?: RunActionConfig<T>
): Promise<Response<Typings['response'], T>>

export async function runAction<
  T extends ActionType,
  Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
>(
  driver: string,
  Action: T,
  config?: Omit<RunActionConfig<T>, 'driver'>,
): Promise<Response<Typings['response'], T>>

export async function runAction<
  T extends ActionType,
  Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
>(
  Action: T | string,
  config?: RunActionConfig<T> | T,
  hasDriverConfig?: RunActionConfig<T>,
): Promise<Response<Typings['response'], T>> {
  const params = resolveParams(Action, config, hasDriverConfig)
  const driverKey = getDriverKey(typeof Action === 'string' ? Action : (params.config?.options as Typings['options'])?.driver)

  const implementation = getImplementation('runAction', driverKey) as RunAction<T>

  const callbacks = makeCallbackArrays(driverKey, params.Action, params.config ?? {})

  await runCallbacks(
    callbacks.beforeRun,
    [{
      options: params.config?.options,
      payload: params.config?.payload,
    }],
  )

  const runPromise = implementation(
    params.Action as T,
    params.config as Typings['options'],
  )

  let response: any = undefined

  return runPromise.then(async (result) => {
    if (result.status === 'success') {
      response = result.response

      await runCallbacks(
        callbacks.onSuccess,
        [{
          options: params.config?.options,
          payload: params.config?.payload,
          response: result.response,
        }],
      )
    }
    else if (result.status === 'standardError') {
      response = undefined

      await runCallbacks(
        callbacks.onStandardError,
        [{
          options: params.config?.options,
          payload: params.config?.payload,
          standardErrors: result.standardErrors,
        }],
      )

      await runCallbacks(
        callbacks.onError,
        [{
          options: params.config?.options,
          payload: params.config?.payload,
          kind: 'standard',
          standardErrors: result.standardErrors,
        }],
      )
    }
    else if (result.status === 'validationError') {
      response = undefined

      await runCallbacks(
        callbacks.onValidationError,
        [{
          options: params.config?.options,
          payload: params.config?.payload,
          validationErrors: result.validationErrors,
        }],
      )

      await runCallbacks(
        callbacks.onError,
        [{
          options: params.config?.options,
          payload: params.config?.payload,
          kind: 'validation',
          validationErrors: result.validationErrors,
        }],
      )
    }

    return result
  }).finally(async () => {
    await runCallbacks(
      callbacks.onFinally,
      [{
        options: params.config?.options,
        payload: params.config?.payload,
        response,
      }],
    )
  })
}
