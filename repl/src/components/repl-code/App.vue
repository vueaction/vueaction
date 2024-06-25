<script lang="ts" setup>
import { useAction } from '@vueaction/core'
import { ChangePasswordAction, ChangePasswordOptions, ChangePasswordPayload } from './ChangePasswordAction'
import { setActions } from './setActions'

// NOTE: Vue action requires a driver. This example uses the "javascript" driver
// with a mock latency of 400ms to help demonstrate the library.

// Since this is for demonstation purposes, rather than using a real API,
// we map some functions that VueAction can trigger.
setActions({
  'change-password'(payload: ChangePasswordPayload, options: ChangePasswordOptions) {
    alert('changing password: ' + JSON.stringify(payload, null, 2))
    console.log('options: ', options)
  }
})

const changePasswordAction = useAction(ChangePasswordAction)
</script>

<template>
  <div>
    <input
      v-model="changePasswordAction.payload.value.oldPassword"
      placeholder="old password"
    />

    <br />

    <input
      v-model="changePasswordAction.payload.value.newPassword"
      placeholder="new password"
    />

    <br />

    <button
      @click="changePasswordAction.run()"
      :disabled="changePasswordAction.running.value"
    >
      {{ changePasswordAction.running.value ? 'changing...' : 'Change Password' }}
    </button>
  </div>
</template>