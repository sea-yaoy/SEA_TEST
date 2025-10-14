/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react"
import { Box, Button, useDisclosure } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TableNotice from "components/Table/TableNotice"
import { Pagination } from "ui-lib/pagination"
import { INotice } from "interfaces/models"
import { noticeService } from "services/notice"
import { ROW_PER_PAGE } from "constants/app"
import { commonRequestData } from "utils/common"
import { IDeleteNotice, IGetAllNotice } from "interfaces/request"
import { ScreenName } from "constants/enum"

const NoticePage = () => {
  const { isOpen, onToggle } = useDisclosure()

  const [notice, setNotice] = useState<INotice[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })

  const getNotice = async (page?: number) => {
    await noticeService
      .getAll(
        commonRequestData(ScreenName.notice, {
          p: page ? page : 1,
        }) as IGetAllNotice,
      )
      .then((res) => {
        const { tableData, currentPage, totalPage } = res
        setNotice(tableData)
        setPagination({
          current: currentPage ?? 1,
          total: totalPage ?? 1,
        })
      })
  }

  useEffect(() => {
    getNotice()
  }, [])

  const updateNotice = () => {
    getNotice(pagination.current)
  }
  const deleteNotice = (no: string) => async () => {
    await noticeService
      .delete(
        commonRequestData(ScreenName.notice, {
          no,
        }) as IDeleteNotice,
      )
      .then((res) => {
        if (res.status === "success") {
          getNotice(
            notice.length === 1
              ? pagination.current - 1 ?? 1
              : pagination.current,
          )
        }
      })
  }

  const onChangePagination = (page: number) => {
    getNotice(page)
  }

  return (
    <Layout namespace="notice">
      <Box mt="2.4rem" w="100%" display="flex" justifyContent="flex-end">
        <Button onClick={onToggle}>新規追加</Button>
      </Box>

      <TableNotice
        data={notice ?? []}
        updateData={updateNotice}
        deleteData={deleteNotice}
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current}
        totalPages={pagination.total}
      />
    </Layout>
  )
}

export default NoticePage
