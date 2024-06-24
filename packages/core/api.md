## Setup
```ts
import { createApp } from 'vue'
import { createVueAction } from '@vue-action/core'
import { laravelImplementation, createLaravelAction, makeWretchRequester } from '@vue-action/laravel'

const app = createApp({})

const createApiRequester = async () => {
  const token = localStorage.getItem('core-api-token')
  let requester = wretch()
    .url(`${process.env.CORE_API_URL}/actions`)
    .options({ credentials: 'include' })

  if (token) {
    requester = requester.auth(`Bearer ${token}`)
  }
  return requester
}

const laravel = createLaravelAction({
  name: 'coreApi',
  createWretch: createApiRequester,
})

const vueAction = createVueAction({
  default: 'coreApi',
  drivers: {
    coreApi: {
      implementation: laravelImplementation
    }
  }
})

app.use(vueAction)
```

## Basic action object
```ts
import { Action } from '@vueaction/core'

export const ChangePasswordAction: Action = { name: 'change-password' }
```

## Fully typed action object
```ts
interface ChangePasswordActionTypes {
  payload: { newPassword: boolean },
  response: { success: boolean }
}

export const ChangePasswordAction: Action<ChangePasswordActionTypes> = {
  name: 'change-password'
}
```

## Without Composable
```ts
import { runAction } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'

const { response, validationErrors, standardErrors, success } = await runAction(
  ChangePasswordAction,
  { newPassword: 'NewSecret' }, // payload
  {
    onSuccess(response) {
      console.log(response)
    },
    onError(error) {
      console.log(error)
    },
    onValidationError(errors) {
      console.log(errors)
    },
    onFinally() {
      console.log('all done')
    }
  }
)
```

## Basic with composable
```vue
<script lang="ts" setup>
import { ChangePasswordAction } from './ChangePasswordAction'

const changePasswordAction = useAction(ChangePasswordAction, {
  onError() {

  }
})
</script>

<template>
  <q-btn
    :loading="changePasswordAction.running.value"
    @click="changePasswordAction.run()"
  />

  <ValidationErrors
    v-if="changePasswordAction.hasValidationErrors.value"
    :errors="changePasswordAction.validationErrors.value"
  />
  <StandardErrors
    v-if="changePasswordAction.hasStandardErrors.value"
    :errors="changePasswordAction.standardErrors.value"
  />
</template>
```

## Namespaces
```ts
const ChangePasswordAction: Action = {
  namespace: 'auth',
  name: 'change-password',
}
```

## Nested Namespaces
```ts
const ChangePasswordAction: Action = {
  namespace: ['user', 'auth'],
  name: 'change-password',
}
```

## Callbacks
```ts
interface ChangePasswordTypes {
  payload: { persist: boolean },
  response: { success: boolean }
}

const ChangePasswordAction: Action<ChangePasswordTypes> = {
  name: 'change-password',
}

const changePasswordAction = useAction(ChangePasswordAction, {
  onSuccess(response) {
    console.log(response)
  },
  onError(error) {
    console.log(error)
  },
  onValidationError(errors) {
    console.log(errors)
  },
  onFinally() {
    console.log(response)
  }
})

changePasswordAction.run({ persist: true })
```

## Fully typed action object with options
```ts
interface Recipient {
  name: string
  email: string
}

interface Payload {
  tagIds: string[]
  excludeEmails: string[]
}

interface Options {
  persist: boolean
}

interface Response {
  recipients: Recipient[]
}

export const SendCampaignEmailsAction: Action<{ payload: Payload, options: Options, response: Response }> = {
  name: 'send-campaign-emails',
  onSuccess({ response, options, payload }) {
    console.log('success')
  },
  setup({ onSuccess }) {
    const userRepo = useRepo(User)

    onSuccess(response) {
      userRepo.insert(response.user)
    }
  }
}

const sendCampaignAction = useAction(ChangePasswordAction)

sendCampaignAction.run({
  payload: { newPassword: '', oldPassword: '' },
  options: { persist: false },
  onSuccess() { console.log('success') }
})
```

