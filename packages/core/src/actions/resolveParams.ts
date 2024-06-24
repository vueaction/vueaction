import { RunActionConfig } from 'src/contracts/RunAction'
import { Action } from '../contracts/Action'

export function resolveParams(...params: any[]): {
  Action: Action
  config: RunActionConfig
} {
  if (typeof params[0] === 'string') {
    const paramsWithoutDriver = params.slice(1)
    return {
      Action: paramsWithoutDriver[0],
      config: paramsWithoutDriver?.[1] ?? {},
    }
  }

  return {
    Action: params[0],
    config: params?.[1] ?? {},
  }
}
