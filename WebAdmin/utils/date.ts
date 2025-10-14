import { DEFAULT_EMPTY } from "constants/app"
import dayjs, { ConfigType } from "dayjs"
import "dayjs/locale/ja"
import localizedFormat from "dayjs/plugin/localizedFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.locale("ja")
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const ValidFormat = [
  "YYYYMMDDHHmmss",
  "YYYYMMDDHHmm",
  "YYYYMMDD",
  "YYYY/MM/DD",
  "YYYY/MM",
  "YYYYMM",
]

/**
 * @param value The date needs formatting.
 * Default format: YYYY.MM.DD hh:mm
 *
 * Special format: YYYY_MM_DD_DoW_HH_MM => YYYY-MM-DD(DayofWeek ja locale)HH:mm,
 * Important: option [t]:TFunction is required if format YYYY_MM_DD_DoW_HH_MM is selected
 */
export const formatDate = (
  date?: ConfigType,
  format = "YYYY.MM.DD hh:mm",
): string => {
  const mDate = dayjs(date ?? "", ValidFormat)
  if (mDate.isValid()) {
    return mDate.format(format)
  }

  return DEFAULT_EMPTY
}
