/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { IAccount } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.invoiceInfo,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const { p, year, month, email, status } = req.query

  const page = Number(p ?? 1)
  const date = `${year ?? "%"}-${(month as string)?.padStart(2, "0") ?? "%"}-%`
  const _status = `${status ?? "%"}`
  const userMail = `%${email ?? ""}%`

  const data =
    ((await executeQuery(
      `SELECT Billing.BillingNo, Account.Name, Account.MailAddress, Billing.BillingDate, Billing.BillingTotal, Billing.PaymentStatus, Count.TotalRow
      FROM billing_info AS Billing, account_info AS Account
      LEFT JOIN (
        SELECT COUNT(BillingCount.BillingNo) AS TotalRow 
          FROM billing_info AS BillingCount, account_info AS AccountCount
          WHERE AccountCount.AccountNo = BillingCount.AccountNo AND AccountCount.MailAddress LIKE ? AND DATE(BillingCount.BillingDate) LIKE ? AND (BillingCount.PaymentStatus LIKE ?)
      ) AS Count ON true 
      WHERE Account.AccountNo = Billing.AccountNo AND Account.MailAddress LIKE ? AND (DATE(Billing.BillingDate) LIKE ?) AND (Billing.PaymentStatus LIKE ?)
      LIMIT ? OFFSET ?`,
      [
        userMail,
        date,
        _status,
        userMail,
        date,
        _status,
        ROW_PER_PAGE.INVOICE_INFO,
        (page - 1) * ROW_PER_PAGE.INVOICE_INFO,
      ],
    )) as IAccount[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data?.[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.INVOICE_INFO,
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
