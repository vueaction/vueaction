import { describe, beforeEach, it, expect, vi, afterAll } from 'vitest'
import { baseSetup } from '../baseSetup'
import { useAction, vueActionState } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'
import { SetUserRoleAction } from './SetUserRoleAction'
import { UpdateUserProfilePhotoAction } from './UpdateUserProfilePhotoAction'
import { javascriptSetups } from '../implementations/javascriptSetups'
import { wait } from '../helpers/wait'

function getConfig() {
  if (!vueActionState.config) {
    throw new Error('Config is undefined')
  }
  return vueActionState.config
}

function getDriverConfig() {
  if (!vueActionState.drivers.javascript.config) {
    throw new Error('Config is undefined')
  }
  return vueActionState.drivers.javascript.config
}

describe('useAction', () => {
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

  afterEach(() => {
    consoleMock.mockReset()
  })

  beforeEach(async (ctx) => {
    await baseSetup(ctx)
  })

  it('throws an error when trying to use a driver that does not exist', async () => {
    // Unfortunately, we don't currently have a driver for a server on Mars 😞

    expect(() => {
      useAction('mars', ChangePasswordAction, {})
    }).toThrowError('No driver installed')
  })

  it('can run an action', async () => {
    const oldPassword = 'old-password'
    const newPassword = 'new-password'

    const changePasswordAction = useAction(ChangePasswordAction)
    await changePasswordAction.run({
      payload: { newPassword, oldPassword },
    })

    expect(consoleMock).toHaveBeenCalledWith(
      `old password: "${oldPassword}" new password: "${newPassword}"`, oldPassword,
    )
  })

  it('can run a namespaced action', async () => {
    const oldPassword = 'old-password'
    const newPassword = 'new-password'

    const changePasswordAction = useAction(ChangePasswordAction)
    await changePasswordAction.run({
      payload: { newPassword, oldPassword },
    })

    expect(consoleMock).toHaveBeenCalledWith(
      `old password: "${oldPassword}" new password: "${newPassword}"`, oldPassword,
    )
  })

  it('can run a namespaced action using a string', async () => {
    const role = 'admin'

    const setUserRoleAction = useAction(SetUserRoleAction)
    await setUserRoleAction.run({ payload: { role } })

    expect(consoleMock).toHaveBeenCalledWith(
      `setting role to "${role}"`,
    )
  })

  it('can run a namespaced action using an array', async () => {
    const updateUserProfileAction = useAction(UpdateUserProfilePhotoAction)
    await updateUserProfileAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'updating profile photo',
    )
  })

  it('has a "running.value" of "true" while running an action', async () => {
    javascriptSetups.setMockLatency(150)

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    expect(changePasswordAction.running.value)
      .toEqual(false)

    const changePasswordPromise = changePasswordAction.run()

    expect(changePasswordAction.running.value)
      .toEqual(true)

    await changePasswordPromise

    expect(changePasswordAction.running.value)
      .toEqual(false)
  })

  it('runs "Action.setup" when the action is being composed', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'inside "setup()"',
    )
  })

  it('can pass options to the action when composing', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction, {
      payload: { role: 'app-user' },
      options: { persist: true },
    })

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'persisting role change to the store',
    )
  })

  it('can pass options to the action when running', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction, {
      payload: { role: 'app-user' },
    })

    await setUserRoleAction.run({ options: { persist: true } })

    expect(consoleMock).toHaveBeenCalledWith(
      'persisting role change to the store',
    )
  })

  it('merges options when they are both passed during composition, and when running the action', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction, {
      payload: { role: 'app-user' },
      options: { requireLogin: true },
    })

    await setUserRoleAction.run({ options: { persist: true } })

    expect(consoleMock).toHaveBeenCalledWith(
      'persisting role change to the store',
    )
    expect(consoleMock).toHaveBeenCalledWith(
      'requireLogin is true',
    )
  })

  it('merges options when they are both passed during composition, and when running the action', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction, {
      payload: { role: 'app-user' },
      options: { persist: false },
    })

    await setUserRoleAction.run()
    expect(consoleMock).not.toHaveBeenCalledWith(
      'persisting role change to the store',
    )

    await setUserRoleAction.run({ options: { persist: true } })

    expect(consoleMock).toHaveBeenCalledWith(
      'persisting role change to the store',
    )
  })

  it('sets "response.value" when the request is successful', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(setUserRoleAction.response.value).toEqual(true)
  })

  /**
   * Options
   */

  it('can change the options via "someAction.options.value"', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()
    expect(consoleMock).not.toHaveBeenCalledWith(
      'persisting role change to the store',
    )

    setUserRoleAction.options.value.persist = true
    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'persisting role change to the store',
    )
  })

  it('can set defaultOptions via "Action.setupDefaultOptions"', async () => {
    SetUserRoleAction.setupDefaultOptions = {
      hasDefaultOption: true,
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'hasDefaultOption is true',
    )
  })

  it('can set "Action.setupDefaultOptions()" as a function', async () => {
    SetUserRoleAction.setupDefaultOptions = () => ({
      hasDefaultOption: true,
    })
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'hasDefaultOption is true',
    )
  })

  // To do this, we need to run the async function right away, then said options to the result of that function
  it('can set "Action.setupDefaultOptions()" as an async function', async () => {
    SetUserRoleAction.setupDefaultOptions = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ hasDefaultOption: true })
        }, 200)
      })
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'hasDefaultOption is true',
    )
  })

  it('has a "someAction.settingDefaultOptions" of "true" if "setupDefaultOptions" is async, and is being setup', async () => {
    SetUserRoleAction.setupDefaultOptions = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ hasDefaultOption: true })
        }, 300)
      })
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    expect(setUserRoleAction.settingDefaultOptions.value)
      .toEqual(true)
  })

  it('can automatically reset options when the request is complete via "useAction(SomeAction, { resetOptionsOnSuccess: true })"', async () => {
    SetUserRoleAction.setupDefaultOptions = () => ({
      hasDefaultOption: true,
    })

    const setUserRoleAction = useAction(SetUserRoleAction, {
      resetOptionsOnSuccess: true,
    })

    setUserRoleAction.options.value = { persist: true }
    expect(setUserRoleAction.options.value?.persist)
      .toBe(true)
    await setUserRoleAction.run()

    expect(setUserRoleAction.options.value?.persist)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.options.value?.hasDefaultOption)
      .toBe(true)
  })

  it('can globally set "resetOptionsOnSuccess" via "globalConfig.config.resetOptionsOnSuccess"', async () => {
    getConfig().resetOptionsOnSuccess = true

    SetUserRoleAction.setupDefaultOptions = () => ({
      hasDefaultOption: true,
    })

    const setUserRoleAction = useAction(SetUserRoleAction)

    setUserRoleAction.options.value = { persist: true }
    expect(setUserRoleAction.options.value?.persist)
      .toBe(true)
    await setUserRoleAction.run()

    expect(setUserRoleAction.options.value?.persist)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.options.value?.hasDefaultOption)
      .toBe(true)
  })

  it('can globally set "resetOptionsOnSuccess" via "globalConfig.drivers.someDriver.config.resetOptionsOnSuccess"', async () => {
    getDriverConfig().resetOptionsOnSuccess = true

    SetUserRoleAction.setupDefaultOptions = () => ({
      hasDefaultOption: true,
    })

    const setUserRoleAction = useAction(SetUserRoleAction)

    setUserRoleAction.options.value = { persist: true }
    expect(setUserRoleAction.options.value?.persist)
      .toBe(true)
    await setUserRoleAction.run()

    expect(setUserRoleAction.options.value?.persist)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.options.value?.hasDefaultOption)
      .toBe(true)
  })

  /**
   * Payload
   */

  it('can change the payload via "someAction.payload.value"', async () => {
    const setUserRoleAction = useAction(SetUserRoleAction, {
      payload: { role: 'admin' },
    })

    await setUserRoleAction.run()
    expect(consoleMock).toHaveBeenCalledWith(
      'setting role to "admin"',
    )

    setUserRoleAction.payload.value.role = 'editor'
    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'setting role to "editor"',
    )
  })

  it('can set defaultPayload via "Action.setupDefaultPayload"', async () => {
    SetUserRoleAction.setupDefaultPayload = {
      role: 'app user',
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'setting role to "app user"',
    )
  })

  it('can set "Action.setupDefaultPayload()" as a function', async () => {
    SetUserRoleAction.setupDefaultPayload = () => ({
      role: 'app user',
    })
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'setting role to "app user"',
    )
  })

  // To do this, we need to run the async function right away, then set said payload to the result of that function
  it('can set "Action.setupDefaultPayload()" as an async function', async () => {
    SetUserRoleAction.setupDefaultPayload = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ role: 'app user' })
        }, 200)
      })
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    await setUserRoleAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'setting role to "app user"',
    )
  })

  it('has a "someAction.settingDefaultPayload" of "true" if "setupDefaultPayload" is async, and is being setup', async () => {
    SetUserRoleAction.setupDefaultPayload = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ role: 'app user' })
        }, 300)
      })
    }
    const setUserRoleAction = useAction(SetUserRoleAction)

    expect(setUserRoleAction.settingDefaultPayload.value)
      .toEqual(true)
  })

  it('can automatically reset payload when the request is complete via "useAction(SomeAction, { resetPayloadOnSuccess: true })"', async () => {
    SetUserRoleAction.setupDefaultPayload = () => ({
      role: 'app user',
    })

    const setUserRoleAction = useAction(SetUserRoleAction, {
      resetPayloadOnSuccess: true,
    })

    setUserRoleAction.payload.value = { role: 'app user' }
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
    await setUserRoleAction.run()

    expect(setUserRoleAction.payload.value?.role)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
  })

  it('can globally set "resetPayloadOnSuccess" via "globalConfig.config.resetPayloadOnSuccess"', async () => {
    getConfig().resetPayloadOnSuccess = true

    SetUserRoleAction.setupDefaultPayload = () => ({
      role: 'app user',
    })

    const setUserRoleAction = useAction(SetUserRoleAction)

    setUserRoleAction.payload.value = { role: 'app user' }
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
    await setUserRoleAction.run()

    expect(setUserRoleAction.payload.value?.role)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
  })

  it('can globally set "resetPayloadOnSuccess" via "globalConfig.drivers.someDriver.config.resetPayloadOnSuccess"', async () => {
    getDriverConfig().resetPayloadOnSuccess = true

    SetUserRoleAction.setupDefaultPayload = () => ({
      role: 'app user',
    })

    const setUserRoleAction = useAction(SetUserRoleAction)

    setUserRoleAction.payload.value = { role: 'app user' }
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
    await setUserRoleAction.run()

    expect(setUserRoleAction.payload.value?.role)
      .toBeUndefined()

    await wait(100)
    expect(setUserRoleAction.payload.value?.role)
      .toBe('app user')
  })

  /**
   * Callbacks
   * Action.use.x
   */

  it('can add a "Action.setup.beforeRun" callback when an action is being composed', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onSuccess callback',
    )
  })

  it('can add a "Action.setup.onSuccess" callback when an action is being composed', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onSuccess callback',
    )
  })

  it('can add a "Action.setup.onStandardError" callback when an action is being composed', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onStandardError callback',
    )
  })

  it('can add a "Action.setup.onValidationError" callback when an action is being composed', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onValidationError callback',
    )
  })

  it('can add a "Action.setup.onError" callback when an action is being composed, which runs when there is a validation error', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onError callback',
    )
  })

  it('can add a "Action.setup.onError" callback when an action is being composed, which runs when there is a standard error', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'change password onError callback',
    )
  })

  /**
   * Callbacks
   * useAction(SomeAction, { onX })
   */

  it('can add a beforeRun callback via "useAction(SomeAction, { beforeRun })"', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
      beforeRun() {
        console.log('beforeRun callback as param')
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'beforeRun callback as param',
    )
  })

  it('can add a success callback via "useAction(SomeAction, { onSuccess })"', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
      onSuccess() {
        console.log('success callback as param')
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'success callback as param',
    )
  })

  it('can add a standard error callback via "useAction(SomeAction, { onStandardError })"', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
      onStandardError({ standardErrors }) {
        console.log('error as param: ' + standardErrors[0].message)
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'error as param: Password too short',
    )
  })

  it('can add a validation error callback via "useAction(SomeAction, { onValidationError })"', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
      onValidationError({ validationErrors }) {
        console.log('error as param: ' + validationErrors.oldPassword[0])
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'error as param: the old password entered is incorrect',
    )
  })

  it('can add an error callback via "useAction(SomeAction, { onError })" that is triggered on a validation error', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
      onError(ctx) {
        if (ctx.kind === 'validation') {
          console.log('error as param: ' + ctx.validationErrors.oldPassword[0])
        }
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'error as param: the old password entered is incorrect',
    )
  })

  it('can add an error callback via "useAction(SomeAction, { onError })" that is triggered on a standard error', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
      onError(ctx) {
        if (ctx.kind === 'standard') {
          console.log('error as param: ' + ctx.standardErrors[0].message)
        }
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'error as param: Password too short',
    )
  })

  it('can add a finally callback via "useAction(SomeAction, { onFinally })"', async () => {
    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
      onFinally() {
        console.log('onFinally callback as param')
      },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'onFinally callback as param',
    )
  })

  /**
   * Global Callbacks
   * globalConfig.config.onX
   */

  it('can add a global beforeRun callback via "globalConfig.config.beforeRun"', async () => {
    getConfig().beforeRun = () => {
      console.log('globally set beforeRun callback')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set beforeRun callback',
    )
  })

  it('can add a global success callback via "globalConfig.config.onSuccess"', async () => {
    getConfig().onSuccess = () => {
      console.log('globally set onSuccess callback')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onSuccess callback',
    )
  })

  it('can add a standard error callback via "globalConfig.config.onStandardError"', async () => {
    getConfig().onStandardError = () => {
      console.log('globally set onStandardError callback')
    }

    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onStandardError callback',
    )
  })

  it('can add a validation error callback via "globalConfig.config.onValidationError"', async () => {
    getConfig().onValidationError = () => {
      console.log('globally set onValidationError callback')
    }

    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onValidationError callback',
    )
  })

  it('can add an error callback via "globalConfig.config.onError" that is triggered on a validation error', async () => {
    getConfig().onError = () => {
      console.log('globally set onError callback')
    }

    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onError callback',
    )
  })

  it('can add an error callback via "globalConfig.config.onError" that is triggered on a standard error', async () => {
    getConfig().onError = () => {
      console.log('globally set onError callback')
    }

    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: 'blah', oldPassword: 'blee' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onError callback',
    )
  })

  it('can add a global onFinally callback via "globalConfig.config.onFinally"', async () => {
    getConfig().onFinally = () => {
      console.log('globally set onFinally callback')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onFinally callback',
    )
  })

  /**
   * Global Callbacks Scoped to Driver
   * globalConfig.drivers.someDriver.config.onX
   */

  it('can add a global beforeRun callback via "globalConfig.drivers.someDriver.config.beforeRun"', async () => {
    getDriverConfig().beforeRun = () => {
      console.log('globally set beforeRun callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set beforeRun callback for a driver',
    )
  })

  it('can add a global success callback via "globalConfig.drivers.someDriver.config.onSuccess"', async () => {
    getDriverConfig().onSuccess = () => {
      console.log('globally set onSuccess callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onSuccess callback for a driver',
    )
  })

  it('can add a standard error callback via "globalConfig.drivers.someDriver.config.onStandardError"', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    getDriverConfig().onStandardError = () => {
      console.log('globally set onStandardError callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onStandardError callback for a driver',
    )
  })

  it('can add a validation error callback via "globalConfig.drivers.someDriver.config.onValidationError"', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    getDriverConfig().onValidationError = () => {
      console.log('globally set onValidationError callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onValidationError callback for a driver',
    )
  })

  it('can add an error callback via "globalConfig.drivers.someDriver.config.onError" that is triggered on a validation error', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    getDriverConfig().onError = () => {
      console.log('globally set onError callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onError callback for a driver',
    )
  })

  it('can add an error callback via "globalConfig.drivers.someDriver.config.onError" that is triggered on a standard error', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    getDriverConfig().onError = () => {
      console.log('globally set onError callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onError callback for a driver',
    )
  })

  it('can add a global onFinally callback via "globalConfig.drivers.someDriver.config.onFinally"', async () => {
    getDriverConfig().onFinally = () => {
      console.log('globally set onFinally callback for a driver')
    }

    const changePasswordAction = useAction(ChangePasswordAction, {
      payload: { newPassword: '12345678', oldPassword: '87654321' },
    })

    await changePasswordAction.run()

    expect(consoleMock).toHaveBeenCalledWith(
      'globally set onFinally callback for a driver',
    )
  })
})
