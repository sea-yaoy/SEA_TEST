/* eslint-disable prettier/prettier */
import {
  IGetAllPaypeeInfo,
  IAddPaypeeInfo,
  IUpdatePaypeeInfo,
  IDeletePaypeeInfo,
} from "interfaces/request"
import api from "./api"

export const paypeeInfoService = {
  async getAll(params: IGetAllPaypeeInfo) {
    return await api.get("api/paypee-info/get-all", { params })
  },
  async add(params: IAddPaypeeInfo) {
    return await api.post("api/paypee-info/add", params)
  },
  async update(params: IUpdatePaypeeInfo) {
    return await api.post("api/paypee-info/update", params)
  },
  async delete(params: IDeletePaypeeInfo) {
    return await api.post("api/paypee-info/delete", params)
  },
}
