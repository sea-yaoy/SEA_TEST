import api from "./api"
import {
  IGetBilling,
  IGetBillingDetail,
  IUpdateBilling,
} from "interfaces/request"

export const billingInfoService = {
  async getBillingInfo(params: IGetBilling) {
    return await api.get("api/invoice-info/get-all", { params })
  },
  async getBillingDetail(params: IGetBillingDetail) {
    return await api.get("api/invoice-info/get-detail", { params })
  },
  async updateBillingStatus(params: IUpdateBilling) {
    return await api.post("api/invoice-info/update", params)
  },
}
