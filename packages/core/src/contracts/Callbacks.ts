import { ActionTypings, Action } from './Action'
import { Response } from './Response'
import { StandardErrors } from './errors/StandardErrors'
import { ValidationErrors } from './errors/ValidationErrors'

export type OnSuccessCallback<Typings extends ActionTypings = ActionTypings> = (ctx: {
  options: Typings['options']
  payload: Typings['payload']
  response: Typings['response']
}) => void | Promise<void>

export type BeforeRunCallback<Typings extends ActionTypings = ActionTypings> = (ctx: {
  options: Typings['options']
  payload: Typings['payload']
}) => void | Promise<void>

export interface OnErrorCallbackKindStandardCtx<Typings extends ActionTypings = ActionTypings> {
  kind: 'standard'
  standardErrors: StandardErrors
  options: Typings['options']
  payload: Typings['payload']
}

export interface OnErrorCallbackKindValidationCtx<Typings extends ActionTypings = ActionTypings> {
  kind: 'validation'
  validationErrors: ValidationErrors
  options: Typings['options']
  payload: Typings['payload']
}

export type OnErrorCallback<Typings extends ActionTypings = ActionTypings> = (
  ctx: OnErrorCallbackKindStandardCtx<Typings> | OnErrorCallbackKindValidationCtx<Typings>
) => void | Promise<void>

export type OnStandardErrorCallback<Typings extends ActionTypings = ActionTypings> = ((ctx: {
  standardErrors: StandardErrors
  options: Typings['options']
  payload: Typings['payload']
}) => void | Promise<void>)

export type OnValidationErrorCallback<Typings extends ActionTypings = ActionTypings> = ((ctx: {
  validationErrors: ValidationErrors
  options: Typings['options']
  payload: Typings['payload']
}) => void | Promise<void>)

export type OnFinallyCallback<Typings extends ActionTypings = ActionTypings> = (ctx: {
  options: Typings['options']
  payload: Typings['payload']
  response: Response<Typings['response'], Action>
}) => void | Promise<void>

export interface AllCallbacks<Typings extends ActionTypings = ActionTypings> {
  onSuccess: OnSuccessCallback<Typings>
  beforeRun: BeforeRunCallback<Typings>
  onError: OnErrorCallback<Typings>
  onStandardError: OnStandardErrorCallback<Typings>
  onValidationError: OnValidationErrorCallback<Typings>
  onFinally: OnFinallyCallback<Typings>
}
