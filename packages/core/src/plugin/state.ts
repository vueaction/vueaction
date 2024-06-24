import { ValidationErrors } from '../contracts/errors/ValidationErrors'
import { StandardErrors } from '../contracts/errors/StandardErrors'
import { VueActionDriver } from '../contracts/VueActionDriver'
import { NotifyOnErrorOptions } from '../types/NotifyOnErrorOptions'
import { Action } from '../contracts/Action'
import { BeforeRunCallback, OnErrorCallback, OnFinallyCallback, OnStandardErrorCallback, OnSuccessCallback, OnValidationErrorCallback } from '../contracts/Callbacks'

export interface ErrorNotifyErrors {
  standardErrors: StandardErrors
}
export type NotifyErrorsWithValidation = {
  validationErrors: ValidationErrors
} & ErrorNotifyErrors

export type ErrorNotifier = (options: { action: Action, errors: ErrorNotifyErrors }) => void
export type ErrorNotifierWithValidation = (options: { action: Action, errors: NotifyErrorsWithValidation }) => void

export interface VueActionConfig {
  notifyOnError?: NotifyOnErrorOptions | undefined
  immediate?: boolean
  errorNotifier?: ErrorNotifierWithValidation
  resetOptionsOnSuccess?: boolean
  resetPayloadOnSuccess?: boolean
  throw?: boolean | ((response: any | undefined, driver: string) => boolean)
  beforeRun?: BeforeRunCallback
  onSuccess?: OnSuccessCallback
  onStandardError?: OnStandardErrorCallback
  onValidationError?: OnValidationErrorCallback
  onError?: OnErrorCallback
  onFinally?: OnFinallyCallback
}

export interface VueActionState {
  /**
   * The default implementation to be used
   */
  default?: string | (() => string)

  /**
   * Drivers that implement the `VueActionDriver` contract
   */
  drivers: Record<string, VueActionDriver>

  /**
   * Base configuration that all drivers will inherit.
   *
   * This allows you to set a default setting across all drivers. e.g.
   * "always notifying the user when there is a request error".
   * this config has the lowest precedence.
   */
  config?: VueActionConfig
}

export const vueActionState: VueActionState = {
  default: 'default',
  drivers: {},
  config: {},
}
