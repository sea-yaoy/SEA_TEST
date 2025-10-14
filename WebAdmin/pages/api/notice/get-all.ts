/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { INotice } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.notice,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { p } = req.query

  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })
  const data =
    ((await executeQuery(
      `SELECT notice.NotificationNo, notice.Contents, 
      DATE_FORMAT(notice.PeriodStartDate,'%Y-%m-%d %H:%i:%s') as PeriodStartDate, 
      DATE_FORMAT(notice.PeriodEndDate,'%Y-%m-%d %H:%i:%s') as PeriodEndDate, count.TotalRow as TotalRow FROM notice
      LEFT JOIN
      (SELECT COUNT(NotificationNo) AS TotalRow
      FROM notice) AS count
      ON true
      ORDER BY PeriodStartDate DESC
    LIMIT ? OFFSET ?`,
      [ROW_PER_PAGE.NOTICE, (Number(p) - 1) * ROW_PER_PAGE.NOTICE],
    )) as unknown as INotice[]) ?? []
  // eslint-disable-next-line no-console

  const totalPage =
    Math.ceil((data ? data[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.NOTICE) ?? 1
  const currentPage = Number(p) > totalPage ? 1 : Number(p)

  return res.status(200).json({
    tableData: data?.map((item) => {
      const { TotalRow, ...newItem } = item

      return newItem
    }),
    currentPage,
    totalPage,
  })
}
