import { Action, Response, VueActionConfig } from '@vueaction/core'
import { javascriptState } from '../plugin/state'

export function makeMockErrorResponse<T extends Action, R extends Response<T>>(
  options: {
    notifyOnError: boolean | undefined
    config: VueActionConfig
    ModelClass: T
    withValidationErrors: boolean
  },
): R | false {
  if (
    javascriptState.mockStandardErrors?.length
    || Object.keys(javascriptState.mockValidationErrors ?? {}).length
  ) {
    if (options.notifyOnError) {
      options.config?.errorNotifiers?.[options.errorNotifierFunctionKey]?.({
        model: options.ModelClass,
        errors: {
          standardErrors: javascriptState.mockStandardErrors ?? [],
          validationErrors: javascriptState.mockValidationErrors ?? {},
        },
      })
    }

    const result = {
      success: false,
      record: undefined,
      standardErrors: javascriptState.mockStandardErrors ?? [],
      action: options.errorNotifierFunctionKey,
    }

    if (options.withValidationErrors) {
      return {
        ...result,
        validationErrors: (javascriptState.mockValidationErrors ?? {}),
      } as R
    }
    return result as R
  }

  return false
}
