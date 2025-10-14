/* eslint-disable prettier/prettier */
import React, { useRef, useState } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useDisclosure,
  Flex,
  Text,
  Input,
  Box,
} from "@chakra-ui/react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { Pagination } from "ui-lib/pagination"
import {
  IBillingData,
  IGetBillingDetail,
  IDataBillingDetail,
  IUpdateBilling,
} from "interfaces/request"
import { EBillingStatus, ScreenName } from "constants/enum"
import { formatDate } from "utils/date"
import { billingInfoService } from "services/billingInfo"
import { cleanParams, commonRequestData } from "utils/common"
import { formatNumber } from "utils/number"
import { CSV_STATUS } from "constants/app"
import { exportCSV } from "services/exportCSV"
import { CSVLink } from "react-csv"

const initialCSVData = [
  {
    APIName: "",
    BillingDate: "",
    BillingAmount: "",
  },
]
const BILLING_DETAIL_COLUMNS = {
  APIName: "API名",
  BillingDate: "請求発生日",
  BillingAmount: "報酬金額",
}

const TableBillingInfo = ({
  tableData,
  updateStatus,
}: {
  tableData: IBillingData[]
  updateStatus: (no: string, status: string) => void
}) => {
  const { isOpen: isOpenEdit, onToggle: onToggleEdit } = useDisclosure()
  const { isOpen: isOpenDetail, onToggle: onToggleDetail } = useDisclosure()
  const csvLink = useRef<any>(null)

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })
  const [itemChoose, setItemChoose] = useState({} as IBillingData)
  const [dataDetail, setDataDetail] = useState<IDataBillingDetail[]>([])
  const [csvData, setCsvData] = useState(initialCSVData)
  const [csvName, setCsvName] = useState("")
  const [isOpenConfirmCsv, setOpenConfirmCsv] = useState(false)

  const handleClickDetail = (item: IBillingData) => async () => {
    setItemChoose(item)
    setDataDetail([])
    await handleGetDataDetail(1, item.BillingNo, onToggleDetail)
  }

  const handleGetDataDetail = async (
    page: number,
    no: string,
    callback?: () => void,
  ) => {
    const res = await billingInfoService.getBillingDetail(
      commonRequestData(
        ScreenName.invoiceInfo,
        cleanParams({
          no: no,
          p: page || 1,
        }),
      ) as IGetBillingDetail,
    )
    if (res?.tableData) {
      const { tableData, currentPage, totalPage } = res
      setDataDetail(tableData || [])
      setPagination({ current: currentPage, total: totalPage })
      callback?.()
    }
  }

  const handleUpdateStatus = async () => {
    const res = await billingInfoService.updateBillingStatus(
      commonRequestData(
        ScreenName.invoiceInfo,
        cleanParams({
          no: itemChoose.BillingNo,
          status: (+!+itemChoose.PaymentStatus).toString(),
        }),
      ) as IUpdateBilling,
    )
    if (res.status === "success") {
      updateStatus(
        itemChoose.BillingNo,
        (+!+itemChoose.PaymentStatus).toString(),
      )
    }
    onToggleEdit()
  }

  // TODO:
  // const handleClickEdit = (item: IBillingData) => () => {
  //   setItemChoose(item)
  //   onToggleEdit()
  // }

  const onDownloadCsv = async () => {
	commonRequestData(
      ScreenName.invoiceInfo,
      cleanParams({
        no: itemChoose.BillingNo,
        status: (+!+itemChoose.PaymentStatus).toString(),
      }),
    )
    const csvRes = await exportCSV.getInvoiceDetailInfoCsv(
      commonRequestData(ScreenName.invoiceInfo, {
        itemId: itemChoose.BillingNo,
      }) as { itemId: string },
    )

    if (csvRes?.tableData) setCsvData(csvRes.tableData)
    // Update PaymentStatus of record
    const statusRes = await exportCSV.updateBillingStatus(
      commonRequestData(ScreenName.invoiceInfo, {
        billingNo: itemChoose.BillingNo,
      }) as { billingNo: string },
    )

    if (statusRes.status === "success") {
      // Update status of record in table
      updateStatus(itemChoose.BillingNo, "1")

      // Download CSV
	  setCsvName(`${formatDate(new Date(), "YYYY-MM-DD")}請求情報検CSV`)
      const timmer = setTimeout(() => {
        clearTimeout(timmer)
        csvLink?.current?.link?.click()
      }, 0)
    }

    setOpenConfirmCsv(false)
  }

  // Mapping data to CSV format (title and value)
  const getCSVData = () => {
    const result = csvData.map((obj) => {
      return Object.fromEntries(
        Object.entries(obj).map((item) => {
          let val = item[1]
          if (["BillingDate"].includes(item[0]))
            val = formatDate(item[1], "YYYY-MM-DD")

          return [
            BILLING_DETAIL_COLUMNS[
              item[0] as keyof typeof BILLING_DETAIL_COLUMNS
            ],
            val,
          ]
        }),
      )
    })

    return result
  }

  const renderBilingStatusLabel = (status: string) => {
    const statusObj = CSV_STATUS.find((item) => item.value === status)

    return statusObj?.label
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            <Th w="25rem">メールアドレス</Th>
            <Th w="25rem">請求日</Th>
            <Th w="21.4rem">合計請求金額</Th>
            <Th w="21.4rem">処理状態</Th>
            <Th w="21.4rem">明細</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.length ? (
            tableData.map((row, i) => (
              <Tr key={i} h="3.6rem">
                <Td
                  maxW="25rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis"> {row.MailAddress}</Text>
                </Td>
                <Td
                  maxW="25rem"
                  textAlign="center"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">
                    {formatDate(row?.BillingDate, "YYYY/MM/DD")}
                  </Text>
                </Td>

                <Td
                  maxW="21.4rem"
                  isTruncated
                  textAlign="right"
                  px="0.8rem !important"
                >
                  {formatNumber(row.BillingTotal, 0, {
                    unit: "円",
                  })}
                </Td>
                <Td
                  maxW="21.4rem"
                  isTruncated
                  textAlign="center"
                  px="0.8rem !important"
                >
                  {renderBilingStatusLabel(row.PaymentStatus)}
                </Td>
                <Td maxW="21.4rem">
                  <Button onClick={handleClickDetail(row)} mr="0.8rem">
                    明細
                  </Button>
                  {/* <Button onClick={handleClickEdit(row)}>編集</Button> */}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr w="100%">
              <Td colSpan={5} p={0} border="none">
                <Flex
                  mt="0.8rem"
                  h="10rem"
                  fontSize="2rem"
                  fontWeight="bold"
                  color="#D3D7D9"
                  bg="#F9F9FA"
                  justifyContent="center"
                  alignItems="center"
                  border="1px solid #ECEDEE"
                >
                  No Data
                </Flex>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {/* MODAL EDIT */}
      <ModalAdmin
        modalW="md"
        isOpen={isOpenEdit}
        onClose={onToggleEdit}
        onClickRightButton={handleUpdateStatus}
      >
        <Text fontSize="1.6rem" fontWeight="medium">
          {!+itemChoose.PaymentStatus
            ? "ステータスを「入金済」へ変更します。"
            : "ステータスを「請求済」に戻します。"}
          <br />
          よろしいですか？
        </Text>
      </ModalAdmin>

      {/* MODAL DETAIL */}
      <ModalAdmin
        modalW="md"
        isOpen={isOpenDetail}
        onClose={onToggleDetail}
        onClickRightButton={() => {
          //
          onToggleDetail()
        }}
        buttonLeftProps={{
          hidden: true,
        }}
        buttonMenuProps={{
          justifyContent: "center",
        }}
        labelButtonRight="閉じる"
      >
        <Flex alignItems="center">
          <Text fontSize="1.6rem" fontWeight="medium" minW="15rem">
            ユーザー名
          </Text>
          <Input h="4.8rem" value={itemChoose.Name} readOnly />
          <Button
            ml="0.8rem"
            disabled={dataDetail.length === 0}
            onClick={() => setOpenConfirmCsv(true)}
          >
            CSV出力
          </Button>
        </Flex>
        <Flex mt="1.6rem" alignItems="center">
          <Text fontSize="1.6rem" fontWeight="medium" minW="15rem">
            合計請求金額
          </Text>
          <Input
            textAlign="end"
            h="4.8rem"
            value={formatNumber(itemChoose.BillingTotal, 0, {
              unit: "円",
            })}
            readOnly
          />
        </Flex>

        <Table mt="1.6rem">
          <Thead>
            <Tr>
              <Th>API名</Th>
              <Th>請求発生日</Th>
              <Th>報酬金額</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataDetail.length ? (
              dataDetail.map((item) => (
                <Tr key={item.BillingDetailNo}>
                  <Td textAlign="left">{item.APIName}</Td>
                  <Td textAlign="center">
                    {formatDate(item.BillingDate, "YYYY/MM/DD")}
                  </Td>
                  <Td textAlign="right">
                    {formatNumber(item.BillingAmount, 0, {
                      unit: "円",
                    })}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr w="100%">
                <Td colSpan={5} p={0} border="none">
                  <Flex
                    mt="0.8rem"
                    h="10rem"
                    fontSize="2rem"
                    fontWeight="bold"
                    color="#D3D7D9"
                    bg="#F9F9FA"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid #ECEDEE"
                  >
                    No Data
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Pagination
          w="100%"
          mt="1.6rem"
          changeCurrentPage={(page: number) => {
            setPagination({ ...pagination, current: page })
            handleGetDataDetail(page, itemChoose.BillingNo)
          }}
          currentPage={pagination.current}
          totalPages={pagination.total}
        />
      </ModalAdmin>

      {/* MODAL CONFIRM CSV */}
      <ModalAdmin
        modalW="md"
        isOpen={isOpenConfirmCsv}
        onClose={() => setOpenConfirmCsv(false)}
        labelButtonRight="CSV出力"
        onClickRightButton={onDownloadCsv}
      >
        {itemChoose.PaymentStatus === EBillingStatus.FINISHED ? (
          <>
            <Text color="red" fontSize="1.85rem" fontWeight="medium">
              CSV出力済データです。
            </Text>
            <Text fontSize="1.6rem" fontWeight="medium">
              CSVを出力し、CSV出力済としますがよろしいですか？
            </Text>
          </>
        ) : (
          <Text fontSize="1.6rem" fontWeight="medium">
            当該ユーザー分のCSVを出力し、CSV出力済としますがよろしいですか？
          </Text>
        )}
        <Box hidden>
          <CSVLink
            data={getCSVData()}
            filename={csvName}
            ref={csvLink}
            target="_blank"
          />
        </Box>
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableBillingInfo
