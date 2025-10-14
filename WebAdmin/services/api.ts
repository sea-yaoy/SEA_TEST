/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import {
  API_APP_ERROR_CODE,
  AXIOS_TIMEOUT_CODE,
  AXIOS_TIMEOUT_ERROR_MESSAGE,
  ERROR_MESSAGE,
  ERR_INTERNET_DISCONNECTED,
  NETWORK_ERROR,
} from "constants/api"
import { BaseResponse } from "interfaces/response"
import { setLoading } from "redux/appSlice"
import store from "redux/store"
import baseAxios from "services/baseAxios"
import { errorProcess } from "utils/dialog"
import { logDev, logError } from "utils/logs"

export const validateStatus = (status: number) => {
  return (status >= 200 && status <= 304) || status === 403
}

const errorHandle = async (
  url: string,
  error: AxiosError,
  hasLoading: boolean,
) => {
  // eslint-disable-next-line no-console
  const currentError = JSON.parse(JSON.stringify(error) ?? "")

  if (
    currentError?.message === ERR_INTERNET_DISCONNECTED ||
    currentError?.message === NETWORK_ERROR
  ) {
    errorProcess.show(ERROR_MESSAGE["NETWORK-ERROR"])

    return {
      apiPath: url,
      errorCode: currentError?.message,
    } as BaseResponse
  }

  const errorRes = {
    apiPath: url,
    errorCode: error.response?.status || error.message,
  } as BaseResponse
  if (error?.response) {
    const statusCode = error.response.status
    switch (statusCode) {
      case 503:
        errorProcess.show(ERROR_MESSAGE["SYSTEM-ERROR"])

        return errorRes
      case 400:
        errorProcess.show(ERROR_MESSAGE["SYSTEM-ERROR"])

        return errorRes
      case 403:
        errorProcess.show(ERROR_MESSAGE["SYSTEM-ERROR"])

        return errorRes
      case 500:
        errorProcess.show(ERROR_MESSAGE["SYSTEM-ERROR"])

        return errorRes
      case 401:
        errorProcess.show(ERROR_MESSAGE["SYSTEM-ERROR"])

        return errorRes
      default:
        return errorRes
    }
  } else {
    const config: AxiosRequestConfig = error?.config
    if (config) {
      switch (error.code) {
        case AXIOS_TIMEOUT_CODE:
          if (error.message === AXIOS_TIMEOUT_ERROR_MESSAGE) {
            errorProcess.show(ERROR_MESSAGE["TIMEOUT"])
          }

          return errorRes
      }
    }
    if (error?.isAxiosError) {
    }
  }
  // Unexpected error
  logError("Call api unexpected error")

  return errorRes
}

let callNumber = 0
let timeoutLoading: NodeJS.Timeout

export const startLoading = (hasLoading: boolean) => {
  if (hasLoading) {
    clearTimeout(timeoutLoading)
    callNumber++
    store.dispatch(setLoading(true))
  }
}

export const endLoading = (hasLoading: boolean) => {
  if (hasLoading) {
    callNumber--
    if (callNumber > 0) {
      return
    }
    timeoutLoading = setTimeout(() => {
      store.dispatch(setLoading(false))
    }, 250)
  }
}

const request = async <T = any>(
  url: string,
  config: AxiosRequestConfig,
  hasLoading: boolean,
): Promise<T & BaseResponse> => {
  startLoading(hasLoading)
  let result = null
  try {
    logDev("\x1b[32m%s\x1b[0m", "INFO call api:", JSON.stringify(config))
    const response = await baseAxios(config)
    result = response.data
    if (typeof result === "string") {
      result = JSON.parse(result)
    }
    endLoading(hasLoading)
  } catch (error: any) {
    endLoading(hasLoading)
    // CancelToken
    if (axios.isCancel(error)) {
      logDev(
        "\x1b[32m%s\x1b[0m",
        "INFO request canceled",
        JSON.stringify(config),
        error.message,
      )
      result = {
        apiPath: url,
        errorCode: API_APP_ERROR_CODE.CANCEL,
      } as BaseResponse
    } else {
      // Handle Error
      result = await errorHandle(url, error, hasLoading)
    }
  }

  return result
}

const api = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
    hasLoading = true,
  ) => {
    return request<T>(url, { method: "get", url, ...config }, hasLoading)
  },
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    hasLoading = true,
  ) => {
    return request<T>(url, { method: "post", url, data, ...config }, hasLoading)
  },
}

export default api
