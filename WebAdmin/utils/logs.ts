/* eslint-disable */
import { EnvConfig } from "services/envConfig"

let logDev = (_message?: any, ..._optionalParams: any[]) => {}
let logWarn = (_message?: any, ..._optionalParams: any[]) => {}
let logError = (_message?: any, ..._optionalParams: any[]) => {}

// if (EnvConfig.logLevel.includes("info")) {
//   logDev = console.log.bind(console)
// }
// if (EnvConfig.logLevel.includes("warn")) {
//   logWarn = console.log.bind(console)
// }
// if (EnvConfig.logLevel.includes("error")) {
//   logError = console.error.bind(console)
// }

export { logDev, logWarn, logError }
