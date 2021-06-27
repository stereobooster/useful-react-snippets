// https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-822032151
export type JSONValue =
 | string
 | number
 | boolean
 | null
 | JSONValue[]
 | {[key: string]: JSONValue}

// https://effectivetypescript.com/2020/04/09/jsonify/
export type Jsonify<T> = T extends { toJSON(): infer U }
? U
: T extends object
? {
    [k in keyof T]: Jsonify<T[k]>
  }
: T