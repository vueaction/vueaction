import { Ref, readonly, ref, toValue } from 'vue'
import { Action as ActionType } from '../contracts/Action'
import { UseActionConfigParam, UseActionReturn } from '../contracts/UseAction'
import { ExtractUseActionTypings } from '../types/ExtractActionTypings'
// import { getImplementation } from '../getImplementation'
import { StandardErrors } from '../contracts/errors/StandardErrors'
import { ValidationErrors } from '../contracts/errors/ValidationErrors'
import { BeforeRunCallback, OnErrorCallback, OnFinallyCallback, OnStandardErrorCallback, OnSuccessCallback, OnValidationErrorCallback } from 'src/contracts/Callbacks'
import { resolveDefaultOptions } from './resolveDefaultOptions'
import { getMergedDriverConfig } from '../utils/getMergedDriverConfig'
import { resolveDefaultPayload } from './resolveDefaultPayload'
import { runAction } from '../actions/runAction'

export function useActionImplementation<
  T extends ActionType,
  Typings extends ExtractUseActionTypings<T> = ExtractUseActionTypings<T>,
>(
  Action: T,
  config?: UseActionConfigParam<T>,
): UseActionReturn<T> {
  const driverResolved = config?.driver ?? 'default'
  // const runAction = getImplementation<T, 'runAction'>('runAction', config?.driver ?? 'default')
  const mergedConfig = {
    ...getMergedDriverConfig(driverResolved),
    ...(config ?? {}),
  }

  const running = ref(false)

  const optionsRef = ref(config?.options ?? {}) as Ref<Typings['options']>
  const payloadRef = ref(config?.payload ?? {}) as Ref<Typings['payload']>

  const responseRef = ref<Typings['response']>()

  const standardErrorsRef = ref<StandardErrors>([])
  const validationErrorsRef = ref<ValidationErrors>({})

  let setDefaultOptionsPromise: Promise<Partial<any>>
  const settingDefaultOptions = ref(false)
  async function setDefaultOptions() {
    settingDefaultOptions.value = true
    setDefaultOptionsPromise = resolveDefaultOptions(Action.setupDefaultOptions)
    Object.assign(
      optionsRef.value,
      await setDefaultOptionsPromise,
    )
    settingDefaultOptions.value = false
  }
  setDefaultOptions()

  let setDefaultPayloadPromise: Promise<Partial<any>>
  const settingDefaultPayload = ref(false)
  async function setDefaultPayload() {
    settingDefaultPayload.value = true
    setDefaultPayloadPromise = resolveDefaultPayload(Action.setupDefaultPayload)
    Object.assign(
      payloadRef.value,
      await setDefaultPayloadPromise,
    )
    settingDefaultPayload.value = false
  }
  setDefaultPayload()

  async function mergeOptions(optionsParam?: Typings['options']) {
    return Object.assign(
      {},
      toValue(config?.mergeOptions) ?? {},
      optionsRef.value,
      optionsParam ?? {},
    ) as Typings['options']
  }

  function mergePayloads(payloadParam?: Typings['payload']) {
    return Object.assign(
      {},
      toValue(config?.mergePayload) ?? {},
      payloadRef.value,
      payloadParam ?? {},
    ) as Typings['payload']
  }

  const beforeRunCallbacks: BeforeRunCallback<Typings>[] = []
  const onSuccessCallbacks: OnSuccessCallback<Typings>[] = []
  const onErrorCallbacks: OnErrorCallback<Typings>[] = []
  const onStandardErrorCallbacks: OnStandardErrorCallback<Typings>[] = []
  const onValidationErrorCallbacks: OnValidationErrorCallback<Typings>[] = []
  const onFinallyCallbacks: OnFinallyCallback<Typings>[] = []

  function beforeRun(callback: BeforeRunCallback<Typings>) {
    beforeRunCallbacks.push(callback)
  }
  function onSuccess(callback: OnSuccessCallback<Typings>) {
    onSuccessCallbacks.push(callback)
  }
  function onError(callback: OnErrorCallback<Typings>) {
    onErrorCallbacks.push(callback)
  }
  function onStandardError(callback: OnStandardErrorCallback<Typings>) {
    onStandardErrorCallbacks.push(callback)
  }
  function onValidationError(callback: OnValidationErrorCallback<Typings>) {
    onValidationErrorCallbacks.push(callback)
  }
  function onFinally(callback: OnFinallyCallback<Typings>) {
    onFinallyCallbacks.push(callback)
  }

  if (config?.beforeRun) beforeRun(config.beforeRun)
  if (config?.onFinally) onFinally(config.onFinally)
  if (config?.onSuccess) onSuccess(config.onSuccess)
  if (config?.onError) onError(config.onError)
  if (config?.onStandardError) onStandardError(config.onStandardError)
  if (config?.onValidationError) onValidationError(config.onValidationError)

  const run: UseActionReturn<T>['run'] = async (
    configParam?: {
      options?: Typings['options']
      payload?: Typings['payload']
    },
  ) => {
    running.value = true
    await setDefaultOptionsPromise
    await setDefaultPayloadPromise

    const mergedOptions = await mergeOptions(configParam?.options ?? {})
    const mergedPayload = mergePayloads(configParam?.payload ?? {})

    for (const callback of beforeRunCallbacks) {
      await callback({
        options: mergedOptions,
        payload: mergedPayload,
      })
    }

    const response = await runAction(
      driverResolved,
      Action,
      {
        options: mergedOptions,
        payload: mergedPayload,
      },
    )

    if (response.status === 'standardError') {
      standardErrorsRef.value = response.standardErrors
      for (const callback of onStandardErrorCallbacks) {
        await callback({
          options: mergedOptions,
          payload: mergedPayload,
          standardErrors: response.standardErrors,
        })
      }
      for (const callback of onErrorCallbacks) {
        await callback({
          kind: 'standard',
          options: mergedOptions,
          payload: mergedPayload,
          standardErrors: response.standardErrors,
        })
      }
    }
    else if (response.status === 'validationError') {
      validationErrorsRef.value = response.validationErrors
      for (const callback of onValidationErrorCallbacks) {
        await callback({
          options: mergedOptions,
          payload: mergedPayload,
          validationErrors: response.validationErrors,
        })
      }
      for (const callback of onErrorCallbacks) {
        await callback({
          kind: 'validation',
          options: mergedOptions,
          payload: mergedPayload,
          validationErrors: response.validationErrors,
        })
      }
    }
    else if (response.status === 'success') {
      responseRef.value = response.response
      for (const callback of onSuccessCallbacks) {
        await callback({
          options: mergedOptions,
          payload: mergedPayload,
          response: response.response,
        })
      }
      if (mergedConfig.resetPayloadOnSuccess) {
        payloadRef.value = {}
        setDefaultPayload()
      }
      if (mergedConfig.resetOptionsOnSuccess) {
        optionsRef.value = {}
        setDefaultOptions()
      }
    }

    for (const callback of onFinallyCallbacks) {
      await callback({
        options: mergedOptions,
        payload: mergedPayload,
        response: response,
      })
    }

    running.value = false

    return response
  }

  const actionSetupReturn = Action?.use?.setup?.({
    ...config,
    beforeRun,
    onSuccess,
    onError,
    onStandardError,
    onValidationError,
    onFinally,
  })

  return {
    run,
    running,
    settingDefaultOptions,
    settingDefaultPayload,
    options: optionsRef,
    payload: payloadRef,
    response: readonly(responseRef),
    standardErrors: readonly(standardErrorsRef),
    validationErrors: readonly(validationErrorsRef),
    ...(actionSetupReturn ?? {}),
  }
}
