// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getWebStorage = <T = any>(key: string, fallbackValue = {}): T => {
  if (typeof sessionStorage === "undefined") {
    return fallbackValue as T
  }
  const data = sessionStorage.getItem(key)
  try {
    return (JSON.parse(data as string) || fallbackValue) as T
  } catch (e) {
    return (data || fallbackValue) as T
  }
}

export const setWebStorage = (key: string, value?: string | object) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const removeWebStorage = (key: string) => {
  sessionStorage.removeItem(key)
}

export const getLocalStorage = <T = any>(
  key: string,
  fallbackValue = {},
): T => {
  if (typeof localStorage === "undefined") {
    return fallbackValue as T
  }
  const data = localStorage.getItem(key)
  try {
    return (JSON.parse(data as string) ?? fallbackValue) as T
  } catch (e) {
    return (data || fallbackValue) as T
  }
}
