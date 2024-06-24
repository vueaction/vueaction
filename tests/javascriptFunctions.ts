import { SetUserRoleOptions, SetUserRolePayload } from './usage/SetUserRoleAction'

export const javascriptActions = {
  'change-password': (
    payload: { oldPassword: string, newPassword: string },
  ) => {
    console.log(`old password: "${payload.oldPassword}" new password: "${payload.newPassword}"`, payload.oldPassword)
    return true
  },

  'user': {
    'set-role'(payload: SetUserRolePayload, options?: SetUserRoleOptions) {
      console.log(`setting role to "${payload.role}"`)
      if (options?.persist) {
        console.log('persisting role change to the store')
      }
      if (options?.requireLogin) {
        console.log('requireLogin is true')
      }
      if (options?.hasDefaultOption) {
        console.log('hasDefaultOption is true')
      }
      return true
    },
    profile: {
      'update-profile-photo'() {
        console.log('updating profile photo')
      },
    },
  },
}
