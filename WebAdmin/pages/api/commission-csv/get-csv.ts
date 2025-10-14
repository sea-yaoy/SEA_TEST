/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "POST",
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

  const noArr = req.body.noArr.map((item: string) => `'${item}'`).join(",")
  const data =
    ((await executeQuery(
      `SELECT R.AppDate, R.PaymentMethod, R.PayeeCode, R.AppDetails, R.PaymentDate, R.DetailDate, R.ItemCode, R.Purpose, R.DepCode, R.TaxIncAmount, R.TaxAmount, R.TaxRate
    FROM kb2_reward_info AS R
    LEFT JOIN
        (SELECT DISTINCT PA.AccountNo, PE.PayeeCode
        FROM reward_payment_info AS PA
        LEFT JOIN kb2_payee_info AS PE 
        ON PA.AccountNo = PE.AccountNo) as P
     ON R.PayeeCode = P.PayeeCode 
     WHERE CONCAT(P.AccountNo, DATE(R.PaymentDate)) IN (${noArr})`,
      [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any[]) ?? []

  return res.status(200).json({
    tableData: data,
  })
}
