import { Action } from '@vueaction/core'

export interface SetUserRolePayload {
  role: string
}

export interface SetUserRoleOptions {
  persist?: boolean
  requireLogin?: boolean
  hasDefaultOption?: boolean
}

export const SetUserRoleAction: Action<{
  payload: SetUserRolePayload
  options: SetUserRoleOptions
  response: any
}> = {
  namespace: 'user',
  name: 'set-role',
  run: {
    onSuccess() {
      console.log('inside user.set-role success callback')
    },
  },
}
