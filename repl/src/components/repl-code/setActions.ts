import { JavascriptDriverOptions } from '@vueactions/javascript'

// This is purely for demonstation purposes.
export function setActions(actions: JavascriptDriverOptions.actions) {
  Object.assign(window.actions, actions)
}
