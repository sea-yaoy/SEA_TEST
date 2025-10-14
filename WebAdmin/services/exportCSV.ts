import api from "./api"
import {
  IGetCommissionCsv,
  IGetDetailCSV,
  IUpdateCSV,
} from "interfaces/request"

export const exportCSV = {
  async getRewardPayment(params: IGetCommissionCsv) {
    return await api.get("api/commission-csv/get-all", { params })
  },
  async updateStatus(params: IUpdateCSV) {
    return await api.post("api/commission-csv/update", params)
  },
  async getRewardPaymentDetail(params: IGetDetailCSV) {
    return await api.get("api/commission-csv/get-detail", { params })
  },
  async getCSV(params: IUpdateCSV) {
    return await api.post("api/commission-csv/get-csv", params)
  },

  // Invoice page
  async getInvoiceDetailInfoCsv(payload: { itemId: string }) {
    return await api.post("api/invoice-info/get-csv", payload)
  },
  async updateBillingStatus(payload: { billingNo: string }) {
    return await api.post("api/invoice-info/update-status", payload)
  },
}
