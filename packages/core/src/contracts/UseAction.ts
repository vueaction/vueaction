import { DeepReadonly, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import { Action as ActionType } from './Action'
import { ValidationErrors } from './errors/ValidationErrors'
import { StandardErrors } from './errors/StandardErrors'
import { ExtractUseActionTypings } from '../types/ExtractActionTypings'
import { Response } from './Response'
import { BeforeRunCallback, OnErrorCallback, OnFinallyCallback, OnStandardErrorCallback, OnSuccessCallback, OnValidationErrorCallback } from './Callbacks'

export interface UseActionReturn<
  T extends ActionType,
  Typings extends ExtractUseActionTypings<T> = ExtractUseActionTypings<T>,
> {
  run: (
    config?: { options?: Typings['options'], payload?: Typings['payload'] }
  ) => Promise<Response<Typings['response'], T>>
  options: Ref<Typings['options']>
  payload: Ref<Typings['payload']>
  response: DeepReadonly<Ref<Typings['response'] | undefined>>
  running: DeepReadonly<Ref<boolean>>
  settingDefaultOptions: DeepReadonly<Ref<boolean>>
  settingDefaultPayload: DeepReadonly<Ref<boolean>>
  validationErrors: DeepReadonly<Ref<ValidationErrors>>
  standardErrors: DeepReadonly<Ref<StandardErrors>>
}

export interface UseActionConfigCallbacks<
  T extends ActionType,
  Typings extends ExtractUseActionTypings<T> = ExtractUseActionTypings<T>,
> {
  beforeRun?: BeforeRunCallback<Typings>
  onSuccess?: OnSuccessCallback<Typings>
  onError?: OnErrorCallback<Typings>
  onStandardError?: OnStandardErrorCallback<Typings>
  onValidationError?: OnValidationErrorCallback<Typings>
  onFinally?: OnFinallyCallback<Typings>
}

export interface UseActionConfigBase<
  T extends ActionType,
  Typings extends ExtractUseActionTypings<T> = ExtractUseActionTypings<T>,
> {
  driver?: string
  options?: MaybeRef<Typings['options']>
  payload?: MaybeRef<Typings['payload']>
  mergeOptions?: MaybeRefOrGetter<Typings['options']>
  mergePayload?: MaybeRefOrGetter<Typings['payload']>
  resetOptionsOnSuccess?: boolean
  resetPayloadOnSuccess?: boolean
}

export type UseActionConfigParam<
  T extends ActionType,
> = UseActionConfigBase<T> & UseActionConfigCallbacks<T>

export type UseAction<T extends ActionType> = (
  Action: T,
  config?: UseActionConfigParam<T>
) => UseActionReturn<T>
