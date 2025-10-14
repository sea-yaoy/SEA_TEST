import api from "./api"
import { IReqUpdate } from "interfaces/request"

export const commissionService = {
  async getCommissionFee(params: { mail?: string }) {
    return await api.get("api/commission-rate/get-all", { params })
  },
  async updateCommissionFee(params: IReqUpdate) {
    return await api.post("api/commission-rate/update", params)
  },
}
