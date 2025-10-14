export enum ErrorType {
  OutOfSession = "sessonInvalid",
  Timeout = "timeout",
}

export enum AccountStatus {
  inUse = "0",
  suspended = "1",
}
export enum APIProviderStatus {
  inApp = "0",
  reviewed = "1",
  paid = "2",
}

export enum ScreenName {
  notice = "notice",
  account = "account-info",
  provider = "api-provider",
  paypee = "paypee-info",
  commissionRate = "commission-rate",
  invoiceInfo = "invoice-info",
  commissionCsv = "commission-csv",
}

export enum EMethodPayment {
  creditCard = "0",
  bill = "1",
}
export enum EBillingStatus {
  UN_FINISHED = "0",
  FINISHED = "1",
  ALL = "2",
}
