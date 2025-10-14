import { EBillingStatus } from "./enum"

const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV

export const DEFAULT_EMPTY = "-"
export const MAX_FAVORITE_LIST_NUM = 5

export const ENV = Object.freeze({
  DEV: env === "development",
  STUB: env === "stub",
  PRD: env === "production",
  TEST: env === "test",
})

export const APP_VERSION = process.env.REACT_APP_VERSION || "1.0.0"

export const ROW_PER_PAGE = Object.freeze({
  NOTICE: 10,
  ACCOUNT_INFO: 20,
  API_PROVIDER: 10,
  PAYPEE_INFO: 20,
  INVOICE_INFO: 20,
  INVOICE_INFO_DETAIL: 10,
  REWARD_PAYMENT: 20,
  REWARD_PAYMENT_DETAIL: 10,
})

export const PAGE = {
  notice: {
    title: "全体お知らせ管理",
  },
  "api-provider": {
    title: "プロバイダ登録審査",
  },
  "account-info": {
    title: "会員情報メンテナンス",
  },
  "paypee-info": {
    title: "報酬支払情報メンテナンス",
  },
  "invoice-info": {
    title: "請求情報検索",
  },
  "commission-rate": {
    title: "手数料率メンテナンス",
  },
  "export-csv": {
    title: "報酬CSV出力",
  },
}

export const CSV_COLUMN = {
  AppDate: "申請日",
  PaymentMethod: "支払方法コード",
  PayeeCode: "支払先コード",
  AppDetails: "申請内容",
  PaymentDate: "支払希望日",
  DetailDate: "明細日付",
  ItemCode: "内訳コード",
  Purpose: "目的／内容",
  DepCode: "負担部門コード",
  TaxIncAmount: "税込金額(円)",
  TaxAmount: "税額(円)",
  TaxRate: "税率(%)",
}

export const CSV_STATUS = [
  { label: "CSV出力未済", value: EBillingStatus.UN_FINISHED },
  { label: "CSV出力済", value: EBillingStatus.FINISHED },
  { label: "全て", value: EBillingStatus.ALL },
]
