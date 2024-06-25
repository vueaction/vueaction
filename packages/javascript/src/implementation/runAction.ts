import { ExtractRunActionTypings, Response, getMergedDriverConfig, vueActionState } from '@vueaction/core'
import { Action as ActionType } from '@vueaction/core'
import { RunActionConfig } from '@vueaction/core'
import { JavascriptDriverOptions, javascriptState } from '../plugin/state'
import { get } from '../utils/get'
import { wait } from '../utils/wait'

export async function runAction<
  T extends ActionType,
  Typings extends ExtractRunActionTypings<T> = ExtractRunActionTypings<T>,
>(
  Action: T,
  config?: RunActionConfig<T>,
): Promise<Response<Typings['response'], T>> {
  const vueActionDefaultDriverKey = typeof vueActionState.default === 'function' ? vueActionState.default() : vueActionState.default
  const driverOptions = javascriptState[
    config?.driver
    ?? vueActionDefaultDriverKey
    ?? 'default'
  ] as JavascriptDriverOptions

  const mergedConfig = Object.assign(
    {},
    getMergedDriverConfig(config?.driver),
    config?.options,
  )

  if (driverOptions.mockStandardErrors) {
    return {
      action: Action,
      status: 'standardError',
      standardErrors: driverOptions.mockStandardErrors,
    }
  }

  if (driverOptions.mockValidationErrors) {
    return {
      action: Action,
      status: 'validationError',
      validationErrors: driverOptions.mockValidationErrors,
    }
  }

  let actionExec: ((payload?: Typings['payload'], options?: Typings['options']) => Typings['response'])
  if (Action.namespace) {
    const actionPath = Array.isArray(Action.namespace) ? Action.namespace : [Action.namespace]
    actionExec = (get(driverOptions.actions, actionPath) as any)?.[Action.name] as ((payload?: Typings['payload']) => Typings['response'])
  }
  else {
    actionExec = driverOptions.actions[Action.name] as ((payload?: Typings['payload']) => Typings['response'])
  }

  if (driverOptions.mockLatencyMs) {
    await wait(driverOptions.mockLatencyMs)
  }

  try {
    const response = await actionExec(config?.payload, mergedConfig)
    Action.run?.onSuccess?.({ options: config?.options, payload: config?.payload, response })
    return {
      action: Action,
      response,
      status: 'success',
    }
  }
  catch (error: any) {
    let message = 'unknown error'
    if (typeof error === 'string') {
      message = error
    }
    if (typeof error?.message === 'string') {
      message = error.message
    }

    return {
      action: Action,
      status: 'standardError',
      standardErrors: [
        { message, name: 'unknown error' },
      ],
    }
  }
}
