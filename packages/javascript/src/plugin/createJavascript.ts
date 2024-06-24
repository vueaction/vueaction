import { JavascriptDriverOptions, javascriptState } from './state'

export const createJavascript = (
  options: JavascriptDriverOptions,
) => {
  return {
    install: () => {
      if (!options.name) {
        throw new Error('"name" option is required')
      }
      javascriptState[options.name] = {
        name: options.name,
        actions: options.actions,
      }
    },
  }
}
