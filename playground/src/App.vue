<script setup lang="ts">
import { useAction, runAction } from '@vueaction/core';
import { ChangePasswordAction } from './actions/ChangePasswordAction';

runAction(
  ChangePasswordAction,
  {
  }
)

const changePasswordAction = useAction(ChangePasswordAction)
</script>

<template>
  <div>
    <label>Old Password</label>
    <input v-model="changePasswordAction.payload.value.oldPassword" />

    <label>New Password</label>
    <input v-model="changePasswordAction.payload.value.newPassword">
  </div>
</template>