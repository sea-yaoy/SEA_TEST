import { useEffect, useRef, useState } from "react"
import { getWebStorage } from "utils/storage"

export const useParams = <T = any>(key: string, fallbackValue = {}) => {
  const [params, setParams] = useState(fallbackValue as T)
  const refResolve = useRef<(value: T) => void>()
  const refParams = useRef(
    new Promise<T>((resolve) => {
      refResolve.current = resolve
    }),
  )

  useEffect(() => {
    const value = getWebStorage<T>(key, fallbackValue)
    setParams(value)
    refResolve.current?.(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    params,
    paramsPromise: refParams.current,
  }
}
