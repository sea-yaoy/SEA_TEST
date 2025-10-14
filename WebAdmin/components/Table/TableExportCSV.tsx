/* eslint-disable prettier/prettier */
import React, { SetStateAction, useMemo, useState } from "react"
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
  Checkbox,
} from "@chakra-ui/react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { Pagination } from "ui-lib/pagination"
import { formatNumber } from "utils/number"
import { IGetDetailCSV, IResponseCsv } from "interfaces/request"
import { exportCSV } from "services/exportCSV"
import { cleanParams, commonRequestData } from "utils/common"

interface Props {
  selectItem: string[]
  setSelectItem: React.Dispatch<SetStateAction<string[]>>
  data: IResponseCsv[]
  isShowSelectAll: boolean
}

interface IDetailCSV {
  APIName: string
  BillingAmount: string
}
const statusMapping = ["CSV出力未済", "CSV出力済", "全て"]

const TableExportCSV = ({
  data,
  selectItem,
  setSelectItem,
  isShowSelectAll,
}: Props) => {
  const { isOpen, onToggle } = useDisclosure()
  const [itemChoose, setItemChoose] = useState({} as IResponseCsv)
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })
  const [dataDetail, setDataDetail] = useState<IDetailCSV[]>([])

  const getDetailCSV = async (
    page?: number | undefined,
    item?: IResponseCsv,
  ) => {
    const no =
      item?.AccountNo?.concat(item?.PaymentDueDate ?? "") ?? ""
    const res = await exportCSV.getRewardPaymentDetail(
      commonRequestData(
        "",
        cleanParams({
          p: page ?? 1,
          no,
        }),
      ) as IGetDetailCSV,
    )
    if (res?.tableData) {
      setDataDetail(res.tableData ?? [])
      setPagination({
        current: res.currentPage ?? 1,
        total: res.totalPage ?? 1,
      })
      if (item) onToggle()
    }
  }

  const handleClickDetail = (item: IResponseCsv) => () => {
    setItemChoose(item)
    getDetailCSV(1, item)
  }

  const isSelectAll = useMemo(
    () => selectItem.length === data?.length && data.length > 0,
    [data?.length, selectItem.length],
  )

  const onSelect = (no: string) => () => {
    if (selectItem.includes(no)) {
      setSelectItem(selectItem.filter((item) => item !== no))
    } else {
      setSelectItem([...selectItem, no])
    }
  }
  const onSelectAll = () => {
    if (isSelectAll) {
      setSelectItem([])
    } else {
      setSelectItem(data?.map((item, i) => i.toString()))
    }
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            <Th w="3.2rem" maxW="3.2rem" minW="3.2rem" p="0">
              {isShowSelectAll && (
                <Checkbox
                  bg="white"
                  isChecked={isSelectAll}
                  onChange={onSelectAll}
                  disabled={!data.length}
                />
              )}
            </Th>
            <Th w="25rem">メールアドレス</Th>
            <Th w="25rem">会社名</Th>
            <Th w="10.4rem">報酬金額</Th>
            <Th w="5.4rem">支払状態</Th>
            <Th w="10.4rem">明細</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.length ? (
            data?.map((row, i) => (
              <Tr key={i} h="3.6rem">
                <Td maxW="3.2rem" minW="3.2rem" whiteSpace="break-spaces" p="0">
                  <Checkbox
                    bg="white"
                    isChecked={selectItem.includes(i.toString())}
                    onChange={onSelect(i.toString())}
                  />
                </Td>
                <Td maxW="25rem" textAlign="left" whiteSpace="break-spaces">
                  <Text isTruncated>{row?.Email}</Text>
                </Td>
                <Td
                  maxW="25rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">{row?.CompanyName}</Text>
                </Td>

                <Td
                  maxW="10.4rem"
                  isTruncated
                  textAlign="right"
                  px="0.8rem !important"
                >
                  {formatNumber(row?.PaymentAmount ?? "0", 0, {
                    unit: "円",
                  })}
                </Td>
                <Td
                  maxW="5.4rem"
                  isTruncated
                  textAlign="center"
                  px="0.8rem !important"
                >
                  {statusMapping[+row?.PaymentStatus]}
                </Td>
                <Td maxW="21.4rem">
                  <Button onClick={handleClickDetail(row)} mr="0.8rem">
                    明細
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr w="100%">
              <Td colSpan={6} p={0} border="none">
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

      {/* MODAL DETAIL */}
      <ModalAdmin
        modalW="md"
        isOpen={isOpen}
        onClose={onToggle}
        onClickRightButton={() => {
          //
          onToggle()
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
            会社名
          </Text>
          <Input h="4.8rem" value={itemChoose.CompanyName} readOnly />
        </Flex>
        <Flex mt="1.6rem" alignItems="center">
          <Text fontSize="1.6rem" fontWeight="medium" minW="15rem">
            合計報酬金額
          </Text>
          <Input
            textAlign="end"
            h="4.8rem"
            value={formatNumber(itemChoose.PaymentAmount, 0, {
              unit: "円",
            })}
            readOnly
          />
        </Flex>

        <Table mt="1.6rem">
          <Thead>
            <Tr>
              <Th>API名</Th>
              <Th>報酬金額</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataDetail?.length ? (
              dataDetail?.map((item, i) => (
                <Tr key={i}>
                  <Td textAlign="left">{item?.APIName ?? ""}</Td>
                  <Td textAlign="right">
                    {formatNumber(item?.BillingAmount, 0, {
                      unit: "円",
                    })}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr w="100%">
                <Td colSpan={2} p={0} border="none">
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
          changeCurrentPage={(current) => {
            getDetailCSV(current)
          }}
          currentPage={pagination.current}
          totalPages={pagination.total}
        />
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableExportCSV
