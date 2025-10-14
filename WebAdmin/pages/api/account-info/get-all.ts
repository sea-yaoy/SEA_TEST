/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { IAccount } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.account,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const page = Number(req.query.p ?? 1)
  const name = req.query.name ? `%${req.query.name}%` : "%%"
  const status = req.query.status ? (req.query.status as string) : "%%"

  const data =
    ((await executeQuery(
      `SELECT Account.AccountNo, Account.MailAddress, Account.Name, Account.AccountStatus, Account.PaymentMethod, DATE_FORMAT(Login.LoginDateTime,'%Y-%m-%d %H:%i:%s') as LoginDateTime, count.TotalRow
      FROM account_info AS Account
      LEFT JOIN
        (SELECT AccountNo, MAX(LoginDateTime) as LoginDateTime
        FROM login_info group by AccountNo) AS Login
        ON Account.AccountNo = Login.AccountNo 
      LEFT JOIN (SELECT Name, AccountStatus, COUNT(AccountNo) AS TotalRow
        FROM account_info WHERE account_info.Name LIKE ? AND account_info.AccountStatus LIKE ? ) AS count  
        ON true
      WHERE Account.Name LIKE ? AND Account.AccountStatus LIKE ? 
      ORDER BY Login.LoginDateTime DESC
      LIMIT ? OFFSET ? 
      `,
      [
        name,
        status,
        name,
        status,
        ROW_PER_PAGE.ACCOUNT_INFO,
        (page - 1) * ROW_PER_PAGE.ACCOUNT_INFO,
      ],
    )) as unknown as IAccount[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.ACCOUNT_INFO,
    ) ?? 1
  const currentPage = page > totalPage ? 1 : page

  return res.status(200).json({
    tableData: data?.map((item) => {
      const { TotalRow, ...newItem } = item

      return newItem
    }),
    currentPage,
    totalPage,
    status: status === "%%" ? null : status,
  })
}
