/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "POST",
  screen: ScreenName.commissionRate,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { AccountNo, CommissionRate } = req.body
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  const resData = (await executeQuery(
    "UPDATE api_commission_rate SET CommissionRate = ? WHERE AccountNo = ?",
    [CommissionRate, AccountNo],
  )) as ResultSetHeader

  if (resData.affectedRows) return res.status(200).json({ status: "success" })

  return res.status(500).json({ status: "error" })
}
