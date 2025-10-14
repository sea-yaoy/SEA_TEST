import { errorDialogRef } from "pages/_app"

export const errorProcess = {
  show: (message?: string) => {
    errorDialogRef.current?.show(message)
  },
  toast: (message?: string) => {
    errorDialogRef.current?.showToast(message)
  },
}
