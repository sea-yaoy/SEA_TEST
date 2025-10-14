interface ICommonRequest {
  hash?: string
  time?: string
}

interface IGetAllNotice extends ICommonRequest {
  p?: number
}

interface IAddNotice extends ICommonRequest {
  content: string
  startDate: string
  endDate: string
}

interface IUpdateNotice extends ICommonRequest {
  no: string
  content: string
  startDate: string
  endDate: string
}

interface IDeleteNotice extends ICommonRequest {
  no: string
}

interface IGetAllAccountInfo extends ICommonRequest {
  p?: number
  name?: string
  status?: string | null
}

interface IUpdateAccountInfo extends ICommonRequest {
  noArr: string[]
  status?: string | null
}

interface IUpdateAccountItemInfo extends ICommonRequest {
  no: string
  status: string
  method: string
}

interface IGetAllAPIProvider extends ICommonRequest {
  p?: number
  name?: string
}

interface IUpdateAPIProvider {
  no: string
  status: number
  content: string
}

interface IGetAllPaypeeInfo extends ICommonRequest {
  name?: string
  p?: string
}

interface IAddPaypeeInfo extends ICommonRequest {
  no: string
  code: string
}

interface IUpdatePaypeeInfo extends ICommonRequest {
  no: string
  code: string
}

interface IDeletePaypeeInfo extends ICommonRequest {
  no: string
}
interface IReqGetAll {
  AccountNo: string
}
interface IReqUpdate extends IReqGetAll {
  CommissionRate: string
}
interface IResGetAll extends IReqUpdate {
  CommissionRate: string
  Name: string
}
interface IGetBilling {
  email?: string
  year?: string
  month?: string
  status?: string
}
interface IGetBillingDetail {
  p?: string
  no?: string
}
interface IDataBillingDetail {
  APIName: string
  BillingAmount: string
  BillingDetailNo: string
  BillingDate: string
}
interface IUpdateBilling {
  status?: string
  no?: string
}
interface IBillingData {
  BillingDate: string
  BillingNo: string
  BillingTotal: string
  Name: string
  PaymentStatus: string
  MailAddress?: string
}
interface IGetCommissionCsv {
  p?: number
  year?: string
  month?: string
  status?: string
}
interface IResponseCsv {
  Email: string
  AccountNo: string
  CompanyName: string
  PaymentDueDate: string
  PaymentStatus: string
  PaymentAmount: string
  PaymentDate: string
}

interface IUpdateCSV extends ICommonRequest {
  noArr: string[]
}

interface IGetDetailCSV {
  p?: string
  no?: string
}

export type {
  IGetAllNotice,
  IAddNotice,
  IUpdateNotice,
  IDeleteNotice,
  IGetAllAccountInfo,
  IUpdateAccountInfo,
  IGetAllAPIProvider,
  IUpdateAPIProvider,
  IGetAllPaypeeInfo,
  IAddPaypeeInfo,
  IUpdatePaypeeInfo,
  IDeletePaypeeInfo,
  IReqGetAll,
  IReqUpdate,
  IResGetAll,
  IGetBilling,
  IBillingData,
  IGetBillingDetail,
  IUpdateBilling,
  IDataBillingDetail,
  IGetCommissionCsv,
  IResponseCsv,
  IUpdateAccountItemInfo,
  IUpdateCSV,
  IGetDetailCSV,
}
