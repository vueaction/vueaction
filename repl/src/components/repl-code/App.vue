<script lang="ts" setup>
import { useAction } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'
import { setActions } from './setActions'
import { reactive } from 'vue'

// This is for demonstation purposes. Rather than using a real API,
// we map some functions that VueAction can trigger.
setActions({
  'change-password'() {
    console.log('changing password')
  }
})

const changePasswordAction = reactive(useAction(ChangePasswordAction))
</script>

<template>
  <div>
    <button
      @click="changePasswordAction.run()"
      :disabled="changePasswordAction.running"
    >
      {{ changePasswordAction.running ? 'running' : 'run' }}
    </button>
  </div>
</template>