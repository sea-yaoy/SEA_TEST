/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { IPaypeeInfo } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.paypee,
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
  const mail = req.query.mail ? `%${req.query.mail}%` : "%%"

  const data =
    ((await executeQuery(
      `SELECT Provider.AccountNo, Provider.CompanyName, Provider.Email, Paypee.PayeeCode, count.TotalRow
      FROM api_provider AS Provider 
      LEFT JOIN (
      SELECT PayeeCode, AccountNo FROM kb2_payee_info) AS Paypee 
        ON Paypee.AccountNo = Provider.AccountNo
      LEFT JOIN (SELECT Email, COUNT(Email) AS TotalRow
        FROM api_provider WHERE Email LIKE ?) AS count  
        ON true
      WHERE Provider.Email LIKE ?
      ORDER BY Paypee.PayeeCode IS NULL DESC, Provider.Email ASC
      LIMIT ? OFFSET ?`,
      [
        mail,
        mail,
        ROW_PER_PAGE.PAYPEE_INFO,
        (page - 1) * ROW_PER_PAGE.PAYPEE_INFO,
      ],
    )) as unknown as IPaypeeInfo[]) ?? []

  const totalPage =
    Math.ceil((data ? data[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.PAYPEE_INFO) ??
    1
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
