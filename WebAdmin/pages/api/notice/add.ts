/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"
import { formatDate } from "utils/date"

const CONFIG = {
  method: "POST",
  screen: ScreenName.notice,
}

const YYYY_MM_DD = "YYYY/MM/DD HH:mm:ss"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { content, startDate, endDate } = req.body
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const no = await executeQuery(
    "SELECT MAX(NotificationNo) + 1 AS No FROM notice",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).then((result) => (result as any)[0].No)

  const params = [
    no ?? 1,
    content,
    formatDate(startDate as string, YYYY_MM_DD),
    formatDate(endDate as string, YYYY_MM_DD),
    null,
  ]
  const resData = (await executeQuery(
    "INSERT INTO notice (NotificationNo, Contents, PeriodStartDate, PeriodEndDate, Registrant) VALUES (?, ?,  ?,  ?,  ?)",
    params,
  )) as ResultSetHeader

  if (resData.affectedRows)
    return res.status(200).json({
      status: "success",
      data: {
        NotificationNo: no,
        Contents: content,
        PeriodStartDate: startDate === "-" ? "" : startDate,
        PeriodEndDate: endDate === "-" ? "" : endDate,
      },
    })

  return res.status(500).json({ status: "error" })
}
