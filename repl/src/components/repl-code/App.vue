<script lang="ts" setup>
import { useAction } from '@vueaction/core'
import { ChangePasswordAction, ChangePasswordPayload } from './ChangePasswordAction'
import { setActions } from './setActions'

// This is for demonstation purposes. Rather than using a real API,
// we map some functions that VueAction can trigger.
setActions({
  'change-password'(payload: ChangePasswordPayload) {
    alert('changing password: ' + JSON.stringify(payload))
  }
})

const changePasswordAction = useAction(ChangePasswordAction)
</script>

<template>
  <div>
    <button
      @click="changePasswordAction.run()"
      :disabled="changePasswordAction.running"
    >
      {{ changePasswordAction.running.value ? 'running' : 'run' }}
    </button>
  </div>
</template>