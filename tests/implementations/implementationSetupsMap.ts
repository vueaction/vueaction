import { StandardErrors, VueActionDriverImplementation, ValidationErrors } from '@vueaction/core'
import { App } from 'vue'
import { javascriptSetups } from './javascriptSetups'

export interface ImplementationSetups {
  implementation: VueActionDriverImplementation

  skipIf?: () => boolean

  setMockLatency: (ms: number) => Promise<void>

  setMockValidationErrors: (
    validationErrors: ValidationErrors
  ) => Promise<void>

  setMockStandardErrors: (
    standardErrors: StandardErrors
  ) => Promise<void>

  baseSetup: (
    app: App<Element>,
    testContext: any
  ) => Promise<void>
}

export const implementationSetupsMap: Record<string, ImplementationSetups> = {
  javascript: javascriptSetups,
}
