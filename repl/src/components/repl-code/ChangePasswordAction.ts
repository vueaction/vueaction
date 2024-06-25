import { Action } from '@vueaction/core'

/**
 * In the context of a rest API, this would like be post data
 */
export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

/**
 * We can add option typings for "runAction" and "useAction".
 * For example, you may want the user of the action to be able to
 * show a dialog when the action is successful. These options can then
 * be accepted within "MyAction.use.setup" or callbacks for "runAction"
 */
export interface ChangePasswordOptions {
  showDialogOnSuccess: boolean
}

/**
 * In the context of a REST app, the response would be the
 * response data of a successful http request
 */
export interface ChangePasswordResponse {
  success: boolean
}

export const ChangePasswordAction: Action<{
  payload: ChangePasswordPayload
  options: ChangePasswordOptions
  response: ChangePasswordResponse
}> = {
  // All actions have a "name", and an optional "namespace"
  name: 'change-password',
  use: {
    // When using the action with the composition API, setup is called
    setup({
      // setup exposes useful hooks such as "onSuccess", "onError" and "onValidationError"
      onSuccess,
    }) {
      console.log('inside "setup()"')

      onSuccess(() => {
        console.log('change password onSuccess callback (inside "setup")')
      })
    },
  },
}
