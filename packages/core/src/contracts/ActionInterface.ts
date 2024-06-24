export interface Action<Ctx extends {
  response?: any
  payload?: any
  options?: any
} = {
  response: any
  payload: any
  options: any
}> {
  name: string

  beforeRun?: (ctx: Ctx) => void
  onSuccess?: (ctx: Ctx) => void
  onError?: (ctx: Ctx) => void
  onFinally?: (ctx: Ctx) => void

  setup?: () => {
    beforeRun?: (ctx: Ctx) => void
    onSuccess?: (ctx: Ctx) => void
    onError?: (ctx: Ctx) => void
    onFinally?: (ctx: Ctx) => void
  }
}

export const ChangePasswordAction: Action<{
  options: { persist: true }
}> = {
  name: 'change-password',
}
