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

  const { p, no } = req.query

  const page = Number(p ?? 1)

  const data =
    ((await executeQuery(
      `SELECT Detail.BillingDetailNo, Detail.BillingDate, Detail.BillingAmount, Info.APIName, Count.TotalRow
      FROM billing_detail AS Detail
      LEFT JOIN (
          SELECT InfoBilling.BillingNo, API.APIName
          FROM billing_info AS InfoBilling
              LEFT JOIN api_info AS API 
              ON InfoBilling.APINo = API.APINo
          GROUP BY InfoBilling.BillingNo
      ) AS Info ON Info.BillingNo = Detail.BillingNo
      LEFT JOIN (
          SELECT BillingNo, COUNT(*) AS TotalRow
          FROM billing_detail
          WHERE BillingNo = ?
      ) as Count ON true
      WHERE Detail.BillingNo = ?
      LIMIT ? OFFSET ?`,
      [
        no as string,
        no as string,
        ROW_PER_PAGE.INVOICE_INFO_DETAIL,
        (page - 1) * ROW_PER_PAGE.INVOICE_INFO_DETAIL,
      ],
    )) as IAccount[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data?.[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.INVOICE_INFO_DETAIL,
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
