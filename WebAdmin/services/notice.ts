/* eslint-disable prettier/prettier */
import {
  IAddNotice,
  IDeleteNotice,
  IGetAllNotice,
  IUpdateNotice,
} from "interfaces/request"
import api from "./api"

export const noticeService = {
  async getAll(params: IGetAllNotice) {
    return await api.get("api/notice/get-all", { params })
  },
  async add(params: IAddNotice) {
    return await api.post("api/notice/add", params)
  },
  async update(params: IUpdateNotice) {
    return await api.post("api/notice/update", params)
  },
  async delete(params: IDeleteNotice) {
    return await api.post("api/notice/delete", params)
  },
}
