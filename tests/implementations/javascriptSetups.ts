import { createJavascript, javascriptState, javascriptVueActionDriver } from '../../packages/javascript/src/index'
import { ImplementationSetups } from './implementationSetupsMap'
import { javascriptActions } from '../javascriptFunctions'

export const javascriptSetups: ImplementationSetups = {
  implementation: javascriptVueActionDriver,

  async setMockLatency(ms: number) {
    javascriptState.default.mockLatencyMs = ms
  },

  async setMockValidationErrors(mockValidationErrors) {
    javascriptState.default.mockValidationErrors = mockValidationErrors
  },

  async setMockStandardErrors(mockStandardErrors) {
    javascriptState.default.mockStandardErrors = mockStandardErrors
  },

  async baseSetup(app, context) {
    javascriptState.default = {}

    javascriptState.default.mockStandardErrors = undefined
    javascriptState.default.mockValidationErrors = undefined
    javascriptState.default.mockLatencyMs = 0

    const javascriptAction = createJavascript({
      name: 'default',
      actions: javascriptActions,
    })

    app.use(javascriptAction)
  },
}
