/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "POST",
  screen: ScreenName.paypee,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { no } = req.body
  const valid = checkValidRequest(req, CONFIG)
  if (!valid) return res.end()

  if (valid.status !== 200)
    return res.status(valid.status).json({ status: valid.message })

  if (Number.isInteger(Number(no))) {
    const resData = (await executeQuery(
      "DELETE FROM kb2_payee_info WHERE AccountNo = ?",
      [no],
    )) as ResultSetHeader

    if (resData.affectedRows) return res.status(200).json({ status: "success" })
  }

  return res.status(500).json({ status: "error" })
}
