import { DEFAULT_EMPTY } from "constants/app"

export const formatNumber = (
  value?: number | string | null,
  scale = 0,
  option?: {
    sign?: boolean
    unit?: string
    defaultEmpty?: string
  },
) => {
  const { sign, unit, defaultEmpty } = option || {}
  if (
    value === null ||
    value === "" ||
    typeof value === "undefined" ||
    isNaN(+value)
  ) {
    return defaultEmpty ?? DEFAULT_EMPTY
  }
  let formatedNumber = new Intl.NumberFormat("ja-JP", {
    style: "decimal",
    minimumFractionDigits: scale,
    maximumFractionDigits: scale,
  }).format(+value)

  if (sign) formatedNumber = `${+value > 0 ? "+" : ""}${formatedNumber}`
  if (unit) formatedNumber = `${formatedNumber}${unit}`

  return formatedNumber
}

export const decimalTrunc = (value: string | number, fixed: number) => {
  if ((value ?? "") === "") return DEFAULT_EMPTY
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || 0}})?`)

  return Number(value).toString().match(re)?.[0]
}
