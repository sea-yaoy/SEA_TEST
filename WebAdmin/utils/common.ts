import { DEFAULT_EMPTY } from "constants/app"
import { YYYYMMDDHHmmss } from "constants/date"
import CryptoJS from "crypto-js"
import { formatDate } from "./date"
import { NextApiRequest } from "next"
import { EnvConfig } from "services/envConfig"

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isNullOrEmpty = (
  value?: number | string | null,
): value is null | undefined => {
  return (value ?? "") === ""
}

export const StringFormat = (str: string, ...args: string[]) =>
  str.replace(/{(\d+)}/g, (_match, index) => args[index] || "")

export const removeDuplicates = <T = string | number>(arr: T[]) => {
  const s = new Set(arr)
  const it = s.values()

  return Array.from(it)
}

export const getText = (value?: string | number | null) => {
  return isNullOrEmpty(value) ? DEFAULT_EMPTY : value
}

export const parseData = (data: any) => {
  return JSON.parse(JSON.stringify(data))
}

export const objectToQueryParams = (obj: Object) => {
  return Object.entries(obj)
    .map((item, i) => {
      return `${i ? "&" : "?"}${item[0]}=${item[1]}`
    })
    .join("")
}

export const cleanParams = (params: { [key: string]: any }) => {
  return params
    ? Object.fromEntries(
        Object.entries(params).filter((item) => {
          if ((item[1] ?? "") === "") return false

          return true
        }),
      )
    : {}
}

const isObject = (object: Object) => {
  return object != null && typeof object === "object"
}

export const compareObject = (object1: Object, object2: Object) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    const val1 = object1[key as keyof Object]
    const val2 = object2[key as keyof Object]
    const areObjects = isObject(val1) && isObject(val2)
    if (
      (areObjects && !compareObject(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false
    }
  }

  return true
}

export const convertToHEx = (key: string, time: string) => {
  return CryptoJS.SHA256(`${key}-${formatDate(time, "MMDDHHmmss")}`).toString(
    CryptoJS.enc.Hex,
  )
}

export const commonRequestData = (
  screenId: string,
  params: { [key: string]: number | string | string[] },
) => {
  // const _time = formatDate(new Date(), YYYYMMDDHHmmss)

  return {
    ...params,
    // time: _time,
    // hash: convertToHEx(screenId, _time) as string,
  } as unknown
}

export const checkValidRequest = (
  req: NextApiRequest,
  config: {
    method: string
    screen?: string
  },
) => {
  // if (req.headers.origin && req.headers.origin !== EnvConfig.apiUrl) {
  //   return undefined
  // }

  const method = req?.method?.toUpperCase()
  // const params = method === "GET" ? req.query : req.body

  if (method !== config.method) {
    return {
      status: 405,
      message: "Method Not Allowed",
    }
  }

  // if (
  //   !params.time ||
  //   !params.hash ||
  //   params.hash !== convertToHEx(config.screen ?? "", params.time as string)
  // ) {
  //   return {
  //     status: 400,
  //     message: "Bad Request",
  //   }
  // }

  return {
    status: 200,
    message: "success",
  }
}
