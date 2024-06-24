import {
  VueActionDriver,
  useActionImplementation,
} from '@vueaction/core'
import { runAction } from './implementation/runAction'

export const javascriptVueActionDriver: VueActionDriver['driver'] = {
  runAction,
  useAction: useActionImplementation,
}

export {
  runAction,
}

export { createJavascript } from './plugin/createJavascript'
export * from './plugin/state'
