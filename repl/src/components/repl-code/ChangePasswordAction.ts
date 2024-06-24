import { Action } from '@vueaction/core'

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface ChangePasswordOptions {
  showDialogOnSuccess: boolean
}

export interface ChangePasswordResponse {
  success: boolean
}

export const ChangePasswordAction: Action<{
  payload: ChangePasswordPayload
  options: ChangePasswordOptions
  response: ChangePasswordResponse
}> = {
  name: 'change-password',
  use: {
    setup({
      onSuccess,
    }) {
      console.log('inside "setup()"')

      onSuccess(() => {
        console.log('change password onSuccess callback (inside "setup")')
      })
    },
  },
}
