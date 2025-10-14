/* eslint-disable prettier/prettier */
import React, { ChangeEvent, useEffect, useState } from "react"
import Layout from "components/common/Layout"
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react"
import { Pagination } from "ui-lib/pagination"
import TableBillingInfo from "components/Table/TableBillingInfo"
import { cleanParams, commonRequestData } from "utils/common"
import { billingInfoService } from "services/billingInfo"
import { IGetBilling, IBillingData } from "interfaces/request"
import SelectInput from "components/common/SelectInput"
import { EBillingStatus, ScreenName } from "constants/enum"
import { CSV_STATUS } from "constants/app"

const DEFAULT_CONDITION = {
  email: "",
  year: "",
  month: "",
  status: EBillingStatus.UN_FINISHED,
}

const BillingInfoPage = () => {
  const [searchCondition, setSearchCondition] = useState(DEFAULT_CONDITION)
  const [searchParams, setSearchParams] =
    useState<IGetBilling>(DEFAULT_CONDITION)
  const [listDataTable, setTableData] = useState([] as IBillingData[])

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })

  const getBillingInfo = async (page?: number, paramsSearch?: IGetBilling) => {
    const res = await billingInfoService.getBillingInfo(
      commonRequestData(
        ScreenName.invoiceInfo,
        cleanParams({
          ...paramsSearch,
          p: page || 1,
        }),
      ) as IGetBilling,
    )

    const { tableData, currentPage, totalPage } = res
    setPagination({
      current: currentPage ?? 1,
      total: totalPage ?? 1,
    })

    setTableData(tableData ?? [])
  }

  const updateStatus = (no: string, status: string) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.BillingNo === no) return { ...item, PaymentStatus: status }

        return item
      }),
    )
  }

  // Handle change value of search form
  const onChangeSearchCondition = (
    e: ChangeEvent<HTMLInputElement> | any,
    key: keyof IGetBilling,
  ) => {
    const val = key === "status" ? e.value : e.target.value

    // Handle month valid
    if (
      key === "month" &&
      (+val > 12 || val === "00" || !/^\s*\d*\s*$/.test(val))
    )
      return

    setSearchCondition((prev) => ({
      ...prev,
      [key]: val,
    }))
  }

  const handleSearch = () => {
    const params = {
      email: searchCondition?.email ?? undefined,
      year: searchCondition?.year ?? undefined,
      month: searchCondition?.month ?? undefined,
      status:
        searchCondition.status !== EBillingStatus.ALL
          ? searchCondition.status
          : undefined,
    }

    setSearchParams({ ...params })
    getBillingInfo(1, params)
  }

  const onChangePagination = (page: number) => {
    setPagination({ ...pagination, current: page })
    getBillingInfo(page, searchParams)
  }

  useEffect(() => {
    getBillingInfo(1, searchParams)
  }, [])

  return (
    <Layout namespace="invoice-info">
      <Flex mt="2.4rem" w="fit-content">
        <Text
          pr="1rem"
          minW="18rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          報酬支払月
        </Text>
        <Input
          w="10rem"
          textAlign="right"
          placeholder="2023"
          maxLength={4}
          mr="0.8rem"
          value={searchCondition.year}
          onChange={(evt) => onChangeSearchCondition(evt, "year")}
        />
        <Text
          pr="1rem"
          align="center"
          minW="3rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          年
        </Text>
        <Input
          w="7rem"
          textAlign="right"
          placeholder="1"
          mr="0.8rem"
          value={searchCondition.month}
          maxLength={2}
          onChange={(evt) => onChangeSearchCondition(evt, "month")}
        />
        <Text
          mr="5rem"
          pr="1rem"
          align="center"
          minW="3rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          月
        </Text>
        <Box w="16rem">
          <SelectInput
            options={CSV_STATUS}
            value={
              searchCondition.status == null
                ? null
                : CSV_STATUS[searchCondition.status]
            }
            placeholder="未払・支払済"
            onChange={(evt) => onChangeSearchCondition(evt, "status")}
          />
        </Box>
      </Flex>

      <Flex mt="2.4rem" w="100%" justifyContent="space-between">
        <Flex>
          <Text
            minW="18rem"
            color="#434B51"
            lineHeight="3.6rem"
            fontSize="1.8rem"
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            メールアドレス検索
          </Text>
          <Input
            placeholder="メールアドレス"
            mr="0.8rem"
            w="30rem"
            value={searchCondition.email}
            onChange={(evt) => onChangeSearchCondition(evt, "email")}
          />
        </Flex>

        <Button
          ml="5rem"
          p="0"
          minW="10rem"
          h="3.4rem"
          w="3.4rem"
          border="1px solid #ECEDEE"
          _focus={{
            outline: "none",
          }}
          onClick={() => handleSearch()}
        >
          検索
        </Button>
      </Flex>

      {/* TABLE */}
      <TableBillingInfo tableData={listDataTable} updateStatus={updateStatus} />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current}
        totalPages={pagination.total}
      />
    </Layout>
  )
}

export default BillingInfoPage
