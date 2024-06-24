import { Action } from '@vueaction/core'

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export const ChangePasswordAction: Action<{
  payload: ChangePasswordPayload
  options: any
  response: any
}> = {
  name: 'change-password',
  use: {
    setup({
      onSuccess,
      onError,
      onStandardError,
      onValidationError,

    }) {
      console.log('inside "setup()"')

      onSuccess(() => {
        console.log('change password onSuccess callback')
      })
      onError(() => {
        console.log('change password onError callback')
      })
      onStandardError(() => {
        console.log('change password onStandardError callback')
      })
      onValidationError(() => {
        console.log('change password onValidationError callback')
      })
    },
  },
}
