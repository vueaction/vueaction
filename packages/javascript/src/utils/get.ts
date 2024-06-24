export function get<T>(obj: any, path: (string | number)[]): T | undefined {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}
