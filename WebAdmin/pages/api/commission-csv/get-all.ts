/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.commissionCsv,
}

interface IRewardPayment {
  TotalRow?: number
  CompanyName?: string
  PaymentAmount?: string
  PaymentStatus?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const { p, year, month, status } = req.query

  const page = Number(p ?? 1)
  const date = `${year ?? "%"}-${(month as string)?.padStart(2, "0") ?? "%"}-%`
  const _status = `${status ?? "%"}`
  const data =
    ((await executeQuery(
      `SELECT Provider.AccountNo, Provider.CompanyName, Provider.Email, Payment.PaymentDueDate, Payment.PaymentDate, Payment.PaymentAmount, Payment.PaymentStatus, Count.TotalRow
      FROM reward_payment_info AS Payment
      LEFT JOIN
          (SELECT AccountNo, CompanyName, Email
          FROM api_provider) AS Provider
          ON Provider.AccountNo = Payment.AccountNo
      LEFT JOIN (
        SELECT COUNT(*) AS TotalRow 
        FROM reward_payment_info
        WHERE DATE(PaymentDueDate) LIKE ? AND PaymentStatus LIKE ?
      ) AS Count ON true 
      WHERE DATE(Payment.PaymentDueDate) LIKE ? AND Payment.PaymentStatus LIKE ?
      LIMIT ? OFFSET ?`,
      [
        date,
        _status,
        date,
        _status,
        ROW_PER_PAGE.REWARD_PAYMENT,
        (page - 1) * ROW_PER_PAGE.REWARD_PAYMENT,
      ],
    )) as IRewardPayment[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data?.[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.REWARD_PAYMENT,
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
