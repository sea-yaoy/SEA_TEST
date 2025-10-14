import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export interface EnvConfig {
  apiUrl: string
  apiTimeout: number
  logLevel: string
}

export const EnvConfig = publicRuntimeConfig as EnvConfig
