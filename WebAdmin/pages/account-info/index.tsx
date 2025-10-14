/* eslint-disable prettier/prettier */
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TableAccountInfo from "components/Table/TableAccountInfo"
import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Pagination } from "ui-lib/pagination"
import { SearchIcon } from "ui-lib/Icons"
import { IAccount } from "interfaces/models"
import { cleanParams, commonRequestData } from "utils/common"
import { accountInfoService } from "services/accountInfo"
import { AccountStatus, ScreenName } from "constants/enum"
import { IGetAllAccountInfo, IUpdateAccountInfo } from "interfaces/request"

const AccountInfoPage = () => {
  const [accountInfo, setAccountInfo] = useState<IAccount[]>([])

  const [name, setName] = useState("")
  const [changePageName, setChangePageName] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  const [selectItem, setSelectItem] = useState<string[]>([])

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })

  const getStatusByAccountNo = (no: string) => {
    return accountInfo?.find((item) => item.AccountNo === no)?.AccountStatus
  }

  const isDisableButton = useMemo(() => {
    const status = {
      suspend: true,
      inUse: true,
    }

    selectItem.forEach((item: string) => {
      if (getStatusByAccountNo(item) === AccountStatus.suspended) {
        status.inUse = false
      } else {
        status.suspend = false
      }
    })

    return status
  }, [selectItem])

  const getAccountInfo = async (page?: number, changePageName?: string) => {
    const params = cleanParams({
      name: changePageName,
      status,
      p: page ? page : 1,
    })
    await accountInfoService
      .getAll(
        commonRequestData(ScreenName.account, params) as IGetAllAccountInfo,
      )
      .then((res) => {
        const { tableData, totalPage, currentPage } = res
        setAccountInfo(tableData)
        setPagination({
          current: currentPage ?? 1,
          total: totalPage ?? 1,
        })
      })
  }

  useEffect(() => {
    getAccountInfo()
  }, [status])

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSearch = () => {
    getAccountInfo(1, name)
    setChangePageName(name)
  }

  const onChangeStatus = (status: string) => () => {
    if (!!selectItem.length) {
      accountInfoService
        .update(
          commonRequestData(ScreenName.account, {
            noArr: selectItem,
            status,
          }) as IUpdateAccountInfo,
        )
        .then((res) => {
          if (res.status === "success") {
            const newAccountInfo =
              accountInfo?.map((item) => {
                if (selectItem.includes(item?.AccountNo ?? "")) {
                  return { ...item, AccountStatus: status }
                }

                return item
              }) ?? []
            setAccountInfo([...newAccountInfo])
            setSelectItem([])
          }
        })
    }
  }

  const updateItem = (data?: {
    no?: string
    status?: string
    method?: string
  }) => {
    const newAccountInfo =
      accountInfo?.map((item) => {
        if (item.AccountNo === data?.no) {
          return {
            ...item,
            AccountStatus: data?.status,
            PaymentMethod: data?.method,
          }
        }

        return item
      }) ?? []
    setAccountInfo([...newAccountInfo])
  }

  const onChangePagination = (page: number) => {
    setSelectItem([])
    getAccountInfo(page, changePageName)
  }

  return (
    <Layout namespace="account-info">
      <Flex mt="6rem" w="100%" justifyContent="space-between">
        <Flex alignItems="center">
          <Text
            w="20rem"
            color="#434B51"
            lineHeight="3.6rem"
            fontSize="1.8rem"
            fontWeight="medium"
          >
            ユーザー検索​
          </Text>
          <Input
            placeholder="ユーザー名"
            mr="0.8rem"
            value={name}
            onChange={onChangeName}
          />
          <Button
            p="0"
            minW="3.4rem"
            h="3.4rem"
            w="3.4rem"
            bg="white"
            border="1px solid #ECEDEE"
            _focus={{
              outline: "none",
            }}
            onClick={handleSearch}
          >
            <SearchIcon viewBox="0 0 16 16" w="1.4rem" h="1.4rem" />
          </Button>
        </Flex>

        <Box>
          <Button
            mr="0.8rem"
            onClick={onChangeStatus(AccountStatus.suspended)}
            disabled={isDisableButton?.suspend}
          >
            利用停止
          </Button>
          <Button
            onClick={onChangeStatus(AccountStatus.inUse)}
            disabled={isDisableButton?.inUse}
          >
            解除
          </Button>
        </Box>
      </Flex>

      <TableAccountInfo
        data={
          accountInfo?.filter((item) => {
            if (status === null) {
              return true
            } else {
              if (item.AccountStatus === status) return true

              return false
            }
          }) ?? []
        }
        updateItem={updateItem}
        status={status ?? null}
        setStatus={setStatus}
        selectItem={selectItem}
        setSelectItem={setSelectItem}
      />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current ?? 1}
        totalPages={pagination.total ?? 1}
      />
    </Layout>
  )
}

export default AccountInfoPage
