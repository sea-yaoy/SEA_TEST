import { useRouter } from "next/router"
import React from "react"

export const useTabRouter = (
  rootPath: string,
  tabRouter: { [path: string]: number },
) => {
  const router = useRouter()
  const { tab } = router.query
  const [tabIndex, setTabIndex] = React.useState(tabRouter[tab as string] || 0)
  const handleTabsChange = (index: number) => {
    setTabIndex(index)
    router.push(
      `${rootPath}/${Object.keys(tabRouter)[index]}`,
      `${rootPath}/${Object.keys(tabRouter)[index]}`,
      {
        shallow: true,
      },
    )
  }

  return {
    tabIndex,
    handleTabsChange,
    tabName: tab as string,
  }
}
