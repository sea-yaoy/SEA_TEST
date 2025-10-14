/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { IAccount } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.commissionCsv,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const { p, no } = req.query

  const page = Number(p ?? 1)

  const data =
    ((await executeQuery(
      `SELECT S.AccountNo, S.APINo, S.BillingAmount, A.APIName, Count.TotalRow
      FROM received_summary AS S
      LEFT JOIN (
        SELECT DISTINCT AccountNo, APINo, APIName FROM api_info GROUP BY APINo
      ) AS A ON A.APINo = S.APINo AND A.AccountNo = S.AccountNo
      LEFT JOIN (
        SELECT COUNT(*) AS TotalRow FROM received_summary WHERE CONCAT(AccountNo, PaymentDueDate) = ?
      ) AS Count ON true
      WHERE CONCAT(S.AccountNo, S.PaymentDueDate) = ?
      LIMIT ? OFFSET ?`,
      [
        no as string,
        no as string,
        ROW_PER_PAGE.REWARD_PAYMENT_DETAIL,
        (page - 1) * ROW_PER_PAGE.REWARD_PAYMENT_DETAIL,
      ],
    )) as unknown as IAccount[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data?.[0]?.TotalRow ?? 1 : 1) /
        ROW_PER_PAGE.REWARD_PAYMENT_DETAIL,
    ) ?? 1

  const currentPage = page > totalPage ? 1 : page

  return res.status(200).json({
    tableData: data?.map((item) => {
      const { TotalRow, ...newItem } = item

      return newItem
    }),
    currentPage,
    totalPage,
  })
}
