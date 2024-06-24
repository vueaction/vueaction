import { Action } from '../contracts/Action'

export type ExtractAllActionTypings<T> = T extends Action<infer U> ? U : never
export type ExtractRunActionTypings<T> = T extends Action<infer _A, infer U> ? U : never
export type ExtractUseActionTypings<T> = T extends Action<infer _A, infer _B, infer U> ? U : never
