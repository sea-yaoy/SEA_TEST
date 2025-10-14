import cloneDeep from "lodash/cloneDeep"

export const chunkArray = (arr: any[], chunkSize: number) => {
  const cloneArr = cloneDeep(arr)
  const res = []
  while (cloneArr.length > 0) {
    const chunk = cloneArr.splice(0, chunkSize)
    res.push(chunk)
  }

  return res
}

export const mergeArray = (curr: any[]) => (newArr: any[]) => {
  newArr.forEach((b, i) => {
    curr[i] = { ...curr[i], ...b }
  })

  return [...curr]
}

export const paginate = <T = any>(
  array: T[] | undefined,
  pageSize: number,
  currentPage: number,
) => {
  return array?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  ) as T[]
}
