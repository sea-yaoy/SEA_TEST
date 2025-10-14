/* eslint-disable prettier/prettier */
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import Layout from "components/common/Layout"
import { Button, Flex, Input, Text, useDisclosure, Box } from "@chakra-ui/react"
import { Pagination } from "ui-lib/pagination"
import { CSVLink } from "react-csv"
import TableExportCSV from "components/Table/TableExportCSV"
import ModalAdmin from "components/Modal/ModalAdmin"
import SelectInput from "components/common/SelectInput"
import { exportCSV } from "services/exportCSV"
import { cleanParams, commonRequestData } from "utils/common"
import { IGetCommissionCsv, IResponseCsv, IUpdateCSV } from "interfaces/request"
import { formatDate } from "utils/date"
import { formatNumber } from "utils/number"
import { CSV_COLUMN } from "constants/app"

const DEFAULT_DATE = {
  year: "",
  month: "",
  status: 0,
}

export const STATUS = [
  { label: "CSV出力未済", value: 0 },
  { label: "CSV出力済", value: 1 },
  { label: "全て", value: 2 },
]

const initialCSVData = [
  {
    AppDate: "",
    PaymentMethod: "",
    PayeeCode: "",
    AppDetails: "",
    PaymentDate: "",
    DetailDate: "",
    ItemCode: "",
    Purpose: "",
    DepCode: "",
    TaxIncAmount: "",
    TaxAmount: "",
    TaxRate: "",
  },
]

const ExportCSVPage = () => {
  const csvLink = useRef<any>(null)
  const [date, setDate] = useState(DEFAULT_DATE)
  const [data, setData] = useState([] as IResponseCsv[])
  const [selectItem, setSelectItem] = useState<string[]>([])
  const { isOpen, onToggle } = useDisclosure()
  const [csvName, setCsvName] = useState("")
  const [csvData, setCsvData] = useState(initialCSVData)
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })
  const [isShowSelectAll, setIsShowSelectAll] = useState(false)

  const getExportCSV = async (page?: number | undefined) => {
    const { year, month, status } = date
    setSelectItem([])
    setIsShowSelectAll(status === 0)
    if (!+month || !+year)
      setDate((prev) => ({
        ...prev,
        month: !+month ? "" : month,
        year: !+year ? "" : year,
      }))

    const res = await exportCSV.getRewardPayment(
      commonRequestData(
        "",
        cleanParams({
          p: page ?? 1,
          year: !!+year ? year : undefined,
          month: !!+month ? month : undefined,
          status: status !== 2 ? status : undefined,
        }),
      ) as IGetCommissionCsv,
    )
    setData(res.tableData ?? [])
    setPagination({ current: res.currentPage ?? 1, total: res.totalPage ?? 1 })
  }

  useEffect(() => {
    getExportCSV()
  }, [])

  const handleSearch = () => {
    getExportCSV(1)
  }

  const onChangeDate =
    (type: string) => (e: ChangeEvent<HTMLInputElement> | any) => {
      // handle date
      const val = type === "status" ? e.value : e.target.value
      if (
        type === "month" &&
        (+val > 12 || val === "00" || !/^\s*\d*\s*$/.test(val))
      )
        return

      setDate((prev) => ({
        ...prev,
        [type]: val,
      }))
    }

  const onChangePagination = (current: number) => {
    setPagination({ ...pagination, current })
    getExportCSV(current)
  }

  const getCSVData = () => {
    return csvData.map((obj) => {
      return Object.fromEntries(
        Object.entries(obj).map((item) => {
          let val = item[1]
          if (["AppDate", "PaymentDate", "DetailDate"].includes(item[0]))
            val = formatDate(item[1], "YYYY-MM-DD")

          return [CSV_COLUMN[item[0] as keyof typeof CSV_COLUMN], val]
        }),
      )
    })
  }

  const generateID = (type: boolean) => {
    return commonRequestData("", {
      noArr: data.reduce((acc: string[], cur, i) => {
        if (selectItem.includes(i.toString())) {
          return [
            ...acc,
            type
              ? `${cur.AccountNo}${cur.PaymentDueDate}${cur.PaymentAmount}`
              : `${cur.AccountNo}${formatDate(cur.PaymentDate, "YYYY-MM-DD")}`,
          ]
        }

        return acc
      }, []),
    }) as IUpdateCSV
  }

  const handleExportCSV = async () => {
    const csvRes = await exportCSV.getCSV(generateID(false))
    if (!csvRes.tableData) {
      return
    }
    csvRes.tableData.length && setCsvData(csvRes.tableData)

    const updateRes = await exportCSV.updateStatus(generateID(true))
    if (updateRes.status === "success") {
      setData(
        data.map((item, i) => {
          if (selectItem.includes(i.toString())) {
            return {
              ...item,
              PaymentStatus: "1",
            }
          }

          return item
        }),
      )
      setCsvName(`${formatDate(new Date(), "YYYY-MM-DD")}報酬CSV`)
      const timmer = setTimeout(() => {
        clearTimeout(timmer)
        csvLink?.current?.link?.click()
      }, 0)

      onToggle()
    }
  }

  return (
    <Layout namespace="export-csv">
      <Flex mt="2.4rem" w="fit-content">
        <Text
          pr="1rem"
          minW="10rem"
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
          value={date.year}
          onChange={onChangeDate("year")}
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
          value={date.month}
          maxLength={2}
          onChange={onChangeDate("month")}
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
            options={STATUS}
            value={date.status == null ? null : STATUS[date.status]}
            placeholder="未払・支払済"
            onChange={onChangeDate("status")}
          />
        </Box>
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
          onClick={handleSearch}
        >
          検索
        </Button>
      </Flex>
      <Flex justifyContent="flex-end">
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
          disabled={selectItem.length === 0}
          onClick={onToggle}
        >
          CSV出力
        </Button>
      </Flex>

      {/* TABLE */}
      <TableExportCSV
        data={data}
        selectItem={selectItem}
        setSelectItem={setSelectItem}
        isShowSelectAll={isShowSelectAll}
      />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current}
        totalPages={pagination.total}
      />
      <ModalAdmin
        modalW="md"
        isOpen={isOpen}
        onClose={onToggle}
        labelButtonRight="CSV出力"
        onClickRightButton={handleExportCSV}
      >
        {data
          .filter((item, i) => selectItem.includes(i.toString()))
          ?.some((item) => item?.PaymentStatus?.toString() === "1") && (
          <Text color="red" fontSize="1.85rem" fontWeight="medium">
            支払済明細が含まれています。
          </Text>
        )}
        <Text fontSize="1.6rem" fontWeight="medium">
          選択された会社分のCSVを出力し、支払済としますがよろしいですか？
        </Text>
        <Box hidden>
          <CSVLink
            data={getCSVData()}
            filename={csvName}
            ref={csvLink}
            target="_blank"
          />
        </Box>
      </ModalAdmin>
    </Layout>
  )
}

export default ExportCSVPage
