/* eslint-disable prettier/prettier */
import { IGetAllAccountInfo, IUpdateAccountInfo, IUpdateAccountItemInfo } from "interfaces/request"
import api from "./api"

export const accountInfoService = {
  async getAll(params: IGetAllAccountInfo) {
    return await api.get("api/account-info/get-all", { params })
  },

  async update(params: IUpdateAccountInfo) {
    return await api.post("api/account-info/update", params)
  },

  async updateItem(params: IUpdateAccountItemInfo) {
    return await api.post("api/account-info/update-item", params)
  },
}
