import { describe, beforeEach, it, expect, vi, afterAll } from 'vitest'
import { baseSetup } from '../baseSetup'
import { implementationSetupsMap } from '../implementations/implementationSetupsMap'
import { useAction } from '@vueaction/core'
import { ChangePasswordAction } from './ChangePasswordAction'

const implementation = import.meta.env.IMPLEMENTATION ?? 'javascript'

const setups = implementationSetupsMap[implementation]

describe(`runAction - ${implementation}`, () => {
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

  afterEach(() => {
    consoleMock.mockReset()
  })

  beforeEach(async (ctx) => {
    await baseSetup(ctx)
  })

  it('can run an action', async () => {
    //
  })

  it('can return a success response', async () => {
    //
  })

  it('can return a validation error', async () => {
    //
  })

  it('can return a standard error', async () => {
    //
  })
})
