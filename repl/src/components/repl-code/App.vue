<script lang="ts" setup>
import { useAction, Action } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'

const changePasswordAction = useAction(ChangePasswordAction)
</script>

<template>
  <div>
    <button @click="changePasswordAction.run()">Run</button>
  </div>
</template>