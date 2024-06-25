import { describe, beforeEach, it, expect, vi } from 'vitest'
import { baseSetup } from '../baseSetup'
import { runAction, vueActionState } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'
import { javascriptSetups } from '../implementations/javascriptSetups'

describe('runAction', () => {
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

  afterEach(() => {
    consoleMock.mockReset()
  })

  beforeEach(async (ctx) => {
    await baseSetup(ctx)
  })

  /**
   * Basic Usage
   */

  it('can run an action', async () => {
    ChangePasswordAction.run = {
      onSuccess: () => { console.log('password changed') },
    }

    const result = await runAction(ChangePasswordAction, {
      payload: { oldPassword: '123', newPassword: '321' },
    })

    expect(consoleMock).toHaveBeenCalledWith('password changed')
    expect(result.status).toBe('success')
    expect(result.action).toBe(ChangePasswordAction)
    expect(result.response).toBe(true)
  })

  /**
   * runAction(SomeAction, { someCallback }
   */

  it('can trigger the "runAction(SomeAction, { beforeRun }" callback', async () => {
    await runAction(
      ChangePasswordAction,
      { beforeRun: () => { console.log('Action.beforeRun') } },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.beforeRun')
  })

  it('can trigger the "runAction(SomeAction, { onSuccess }" callback', async () => {
    await runAction(
      ChangePasswordAction,
      {
        onSuccess: () => { console.log('Action.onSuccess') },
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.onSuccess')
  })

  it('can trigger the "runAction(SomeAction, { onError }" callback', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    await runAction(
      ChangePasswordAction,
      {
        onError: () => { console.log('Action.onError') },
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.onError')
  })

  it('can trigger the "runAction(SomeAction, { onStandardError }" callback', async () => {
    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    await runAction(
      ChangePasswordAction,
      {
        onStandardError: () => { console.log('Action.onStandardError') },
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.onStandardError')
  })

  it('can trigger the "runAction(SomeAction, { onValidationError }" callback', async () => {
    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    await runAction(
      ChangePasswordAction,
      {
        onValidationError: () => { console.log('Action.onValidationError') },
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.onValidationError')
  })

  it('can trigger the "runAction(SomeAction, { onFinally }" callback', async () => {
    await runAction(
      ChangePasswordAction,
      {
        onFinally: () => { console.log('Action.onFinally') },
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.onFinally')
  })

  /**
   * Action.run.someCallback
   */

  it('can trigger the "Action.run.beforeRun" callback', async () => {
    ChangePasswordAction.run = {
      beforeRun: () => { console.log('Action.run.beforeRun') },
    }

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.beforeRun')
  })

  it('can trigger the "Action.run.onSuccess" callback', async () => {
    ChangePasswordAction.run = {
      onSuccess: () => { console.log('Action.run.onSuccess') },
    }

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.onSuccess')
  })

  it('can trigger the "Action.run.onError" callback', async () => {
    ChangePasswordAction.run = {
      onError: () => { console.log('Action.run.onError') },
    }

    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.onError')
  })

  it('can trigger the "Action.run.onStandardError" callback', async () => {
    ChangePasswordAction.run = {
      onStandardError: () => { console.log('Action.run.onStandardError') },
    }

    javascriptSetups.setMockStandardErrors([
      { message: 'Password too short', name: 'password-short' },
    ])

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.onStandardError')
  })

  it('can trigger the "Action.run.onValidationError" callback', async () => {
    ChangePasswordAction.run = {
      onValidationError: () => { console.log('Action.run.onValidationError') },
    }

    javascriptSetups.setMockValidationErrors({
      oldPassword: ['the old password entered is incorrect'],
    })

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.onValidationError')
  })

  it('can trigger the "Action.run.onFinally" callback', async () => {
    ChangePasswordAction.run = {
      onFinally: () => { console.log('Action.run.onFinally') },
    }

    await runAction(
      ChangePasswordAction,
      {
        payload: { oldPassword: '123', newPassword: '321' },
      },
    )

    expect(consoleMock).toHaveBeenCalledWith('Action.run.onFinally')
  })
})
