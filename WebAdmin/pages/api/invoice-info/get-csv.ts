/* eslint-disable prettier/prettier */
import { ScreenName } from "constants/enum"
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

  const itemId = req.body.itemId

  const data =
    ((await executeQuery(
      `SELECT Detail.BillingDate, Detail.BillingAmount, Info.APIName
      FROM billing_detail AS Detail
      LEFT JOIN (
          SELECT InfoBilling.BillingNo, API.APIName
          FROM billing_info AS InfoBilling
              LEFT JOIN api_info AS API 
              ON InfoBilling.APINo = API.APINo
          GROUP BY InfoBilling.BillingNo
      ) AS Info ON Info.BillingNo = Detail.BillingNo
      WHERE Detail.BillingNo = ${itemId}`,
      [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any[]) ?? []

  return res.status(200).json({
    tableData: data,
  })
}
