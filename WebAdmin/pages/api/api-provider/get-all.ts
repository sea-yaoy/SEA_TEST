/* eslint-disable prettier/prettier */
import { ROW_PER_PAGE } from "constants/app"
import { ScreenName } from "constants/enum"
import { IAccount } from "interfaces/models"
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "services/server"
import { checkValidRequest } from "utils/common"

const CONFIG = {
  method: "GET",
  screen: ScreenName.provider,
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

  const data =
    ((await executeQuery(
      `SELECT *, count.TotalRow
    FROM api_provider
    LEFT JOIN 
      (SELECT COUNT(AppNo) AS TotalRow
      FROM api_provider WHERE PicName LIKE ? ) AS count 
      ON true
    WHERE PicName LIKE ? 
    ORDER BY api_provider.Result ASC
    LIMIT ? OFFSET ?`,
      [
        name,
        name,
        ROW_PER_PAGE.API_PROVIDER,
        (page - 1) * ROW_PER_PAGE.API_PROVIDER,
      ],
    )) as unknown as IAccount[]) ?? []

  const totalPage =
    Math.ceil(
      (data ? data[0]?.TotalRow ?? 1 : 1) / ROW_PER_PAGE.API_PROVIDER,
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
