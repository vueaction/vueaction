import { StandardErrors } from './errors/StandardErrors'
import { ValidationErrors } from './errors/ValidationErrors'
import { Action as ActionType } from './Action'

export interface SuccessResponse<
  ResponseType = any,
  Action extends ActionType = ActionType,
> {
  action: Action
  status: 'success'
  response: ResponseType
}

export interface StandardErrorResponse<
  Action extends ActionType = ActionType,
> {
  action: Action
  status: 'standardError'
  standardErrors: StandardErrors
}

export interface ValidationErrorResponse<
  Action extends ActionType = ActionType,
> {
  action: Action
  status: 'validationError'
  validationErrors: ValidationErrors
}

export type Response<
  ResponseType = any,
  Action extends ActionType = ActionType,
> = SuccessResponse<ResponseType, Action> |
StandardErrorResponse<Action> |
ValidationErrorResponse<Action>
