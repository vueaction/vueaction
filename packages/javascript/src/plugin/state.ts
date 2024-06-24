import { StandardErrors, ValidationErrors } from '@vueaction/core'

export interface JavascriptDriverOptions {
  name: string

  /**
   * An artificial latency for requests. This is used for
   * testing, and can be a good way to "mimic" latency
   * while developing. Especailly useful working with
   * loading spinners.
   */
  mockLatencyMs?: number

  /**
   * Only used for testing. When this value is set, all
   * requests will fail with these standard errors.
   */
  mockStandardErrors?: StandardErrors

  /**
   * When this value is set, all requests will fail with these validation errors.
   * Only intended to be used for testing/development.
   */
  mockValidationErrors?: ValidationErrors

  // eslint-disable-next-line @typescript-eslint/ban-types
  actions: Record<string, Function | Record<string, Function>>
}

export type JavascriptState = Record<string, JavascriptDriverOptions>

export const javascriptState: JavascriptState = {}
