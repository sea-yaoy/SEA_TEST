/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ICommissionRate } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.commissionRate,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const mail = `%${req.query.mail ?? ""}%`

  const data = (await executeQuery(
    `SELECT Account.AccountNo, Account.MailAddress, Account.Name, CommissionRate.CommissionRate, Provider.CompanyName
    FROM account_info AS Account, api_commission_rate AS CommissionRate
    LEFT JOIN
          (SELECT AccountNo, CompanyName, Email
          FROM api_provider) AS Provider
          ON Provider.AccountNo = CommissionRate.AccountNo
    WHERE Account.AccountNo = CommissionRate.AccountNo AND Account.MailAddress LIKE ?
  ORDER BY Provider.CompanyName ASC`,
    [mail],
  )) as ICommissionRate[]

  const tableData = data?.map((item) => {
    return item
  })

  return res.status(200).json({ tableData })
}
