<script lang="ts" setup>
import { useAction } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'
import { setActions } from './setActions'

// This is for demonstation purposes. Rather than using a real API,
// we map some functions that VueAction can use trigger.
setActions({
  'change-password'() {
    console.log('changing password')
  }
})

const changePasswordAction = useAction(ChangePasswordAction)
</script>

<template>
  <div>
    <button @click="changePasswordAction.run()">Run</button>
  </div>
</template>