/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return res.status(403).json({ status: "Invalid CSRF-TOKEN" })
}
