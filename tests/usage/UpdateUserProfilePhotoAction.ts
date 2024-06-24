import { Action } from '@vueaction/core'

export interface UpdateUserProfilePhotoActionPayload {
  role: string
}

export const UpdateUserProfilePhotoAction: Action<{
  payload: any
  options: any
  response: any
}> = {
  namespace: ['user', 'profile'],
  name: 'update-profile-photo',
}
