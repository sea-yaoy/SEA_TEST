interface INotice {
  NotificationNo?: string
  Contents?: string
  PeriodStartDate?: string
  PeriodEndDate?: string
  TotalRow?: number
}

interface IAccount {
  AccountNo?: string
  MailAddress?: string
  Name?: string
  AccountStatus?: string
  LoginDateTime?: string
  PaymentMethod?: string
  TotalRow?: number
}

interface IAPIProvider {
  AppNo?: string
  CompanyName?: string
  DepartmentName?: string
  PicName?: string
  PicNameKana?: string
  PicNameSub?: string
  PicNameSubKana?: string
  PostCode?: string
  Address?: string
  PhoneNumber?: string
  Email?: string
  EmailSub?: string
  DeliveryPlan?: string
  Result?: string
  ScreeningComent?: string
  DecisionComment?: string
  TotalRow?: number
}

interface IPaypeeInfo {
  AccountNo?: string
  PayeeCode?: string
  CompanyName?: string
  MailAddress?: string
  Email?: string
  Name?: string
  TotalRow?: number
}

interface ICommissionRate {
  AccountNo?: string
  CommissionRate?: string
  MailAddress?: string
  Name?: number
  CompanyName?: string
}

export type { INotice, IAccount, IAPIProvider, IPaypeeInfo, ICommissionRate }
