import { createJavascript, javascriptState, javascriptVueActionDriver } from '../../packages/javascript/src/index'
import { ImplementationSetups } from './implementationSetupsMap'
import { javascriptActions } from '../javascriptFunctions'

export const javascriptSetups: ImplementationSetups = {
  implementation: javascriptVueActionDriver,

  async setMockLatency(ms: number) {
    javascriptState.javascript.mockLatencyMs = ms
  },

  async setMockValidationErrors(mockValidationErrors) {
    javascriptState.javascript.mockValidationErrors = mockValidationErrors
  },

  async setMockStandardErrors(mockStandardErrors) {
    javascriptState.javascript.mockStandardErrors = mockStandardErrors
  },

  async baseSetup(app, context) {
    javascriptState.javascript = {}

    javascriptState.javascript.mockStandardErrors = undefined
    javascriptState.javascript.mockValidationErrors = undefined
    javascriptState.javascript.mockLatencyMs = 0

    const javascriptAction = createJavascript({
      name: 'javascript',
      actions: javascriptActions,
    })

    app.use(javascriptAction)
  },
}
