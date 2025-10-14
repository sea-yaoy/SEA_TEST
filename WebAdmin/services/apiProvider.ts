/* eslint-disable prettier/prettier */
import { IGetAllAPIProvider, IUpdateAPIProvider } from "interfaces/request"
import api from "./api"

export const apiProviderService = {
  async getAll(params: IGetAllAPIProvider) {
    return await api.get("api/api-provider/get-all", { params })
  },

  async update(params: IUpdateAPIProvider) {
    return await api.post("api/api-provider/update", params)
  },
}
