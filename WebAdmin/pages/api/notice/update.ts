/* eslint-disable prettier/prettier */
import { checkValidRequest } from "utils/common"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { formatDate } from "utils/date"
import { ScreenName } from "constants/enum"

const CONFIG = {
  method: "POST",
  screen: ScreenName.notice,
}
const YYYY_MM_DD = "YYYY/MM/DD HH:mm:ss"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { no, content, startDate, endDate } = req.body

  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  if (Number.isInteger(Number(no))) {
    const params = [
      content,
      formatDate(startDate as string, YYYY_MM_DD),
      formatDate(endDate as string, YYYY_MM_DD),
      no,
    ]
    const resData = (await executeQuery(
      "UPDATE notice SET Contents = ?, PeriodStartDate = ?, PeriodEndDate = ? WHERE NotificationNo = ?",
      params,
    )) as ResultSetHeader
    if (resData.affectedRows)
      return res.status(200).json({
        status: "success",
      })
  }

  return res.status(500).json({ status: "error" })
}
