/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "POST",
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
  const billingNo = req.body.billingNo

  const resData = (await executeQuery(
    `UPDATE billing_info SET PaymentStatus = 1 WHERE BillingNo = ${billingNo}`,
    [],
  )) as ResultSetHeader

  if (resData.affectedRows) return res.status(200).json({ status: "success" })

  return res.status(500).json({ status: "error" })
}
