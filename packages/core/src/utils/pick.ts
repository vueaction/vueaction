export function pick<T>(obj: T, props: (keyof T)[]): Partial<T> {
  const result: Partial<T> = {}
  for (const prop of props) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result[prop] = obj[prop]
    }
  }
  return result
}
