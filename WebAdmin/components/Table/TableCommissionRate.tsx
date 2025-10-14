import React, { SetStateAction, useMemo } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
  Text,
  Input,
  Checkbox,
  Box,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { formatNumber } from "utils/number"
import { ICommissionRate } from "interfaces/models"
import { DEFAULT_EMPTY } from "constants/app"

interface Props {
  isOpen: boolean // status open modal
  onToggle: () => void // handle open/close modal

  data: ICommissionRate[] // data of table
  selections: string[] // list AccountNo selected in table
  setSelections: React.Dispatch<SetStateAction<string[]>> // set list AccountNo selected in table

  setRowSelect: React.Dispatch<SetStateAction<ICommissionRate>> // set data of row selected
  rowSelect: ICommissionRate // data of row selected
  onEditRecord: () => void // handle edit record
}

const TableCommissionRate = ({
  isOpen,
  onToggle,
  data,
  selections,
  setSelections,
  rowSelect,
  setRowSelect,
  onEditRecord,
}: Props) => {
  /**
   * TODO: waiting spec show checkbox on table
   */

  // Check status of select all checkbox in header table
  const isSelectAll = useMemo(
    () => selections.length === data?.length && data.length > 0,
    [data?.length, selections.length],
  )

  const onSelectRow = (no: string) => () => {
    if (selections.includes(no)) {
      setSelections(selections.filter((item) => item !== no))
    } else {
      setSelections([...selections, no])
    }
  }
  const onSelectAll = () => {
    if (isSelectAll) {
      setSelections([])
    } else {
      setSelections(data?.map((item, i) => i.toString()))
    }
  }

  // Click btn edit of row
  const onClickBtnEdit = (item: ICommissionRate) => () => {
    setRowSelect(item)
    onToggle()
  }

  const onChangeRate = (value: string) => {
    const newDataChoose = { ...rowSelect, CommissionRate: value }
    // setItemChoose({ ...newDataChoose })
    // Send data to page
    setRowSelect({ ...newDataChoose })
  }

  const handleEditRecord = async () => {
    onEditRecord()
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            {/* TODO: waiting spec show checkbox */}
            {/* <Th w="3.2rem" maxW="3.2rem" minW="3.2rem" p="0">
              <Checkbox
                bg="white"
                isChecked={isSelectAll}
                onChange={onSelectAll}
                disabled={!data.length}
              />
            </Th> */}
            <Th w="25rem">メールアドレス</Th>
            <Th w="25rem">会社名</Th>
            <Th w="10.4rem">手数料率</Th>
            <Th w="10.4rem">明細</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.length ? (
            data?.map((row, i) => (
              <Tr key={row.AccountNo} h="3.6rem">
                {/* TODO: waiting spec show checkbox */}
                {/* <Td maxW="3.2rem" minW="3.2rem" whiteSpace="break-spaces" p="0">
                  <Checkbox
                    bg="white"
                    isChecked={selections.includes(i.toString())}
                    onChange={onSelectRow(i.toString())}
                  />
                </Td> */}
                <Td maxW="25rem" textAlign="left" whiteSpace="break-spaces">
                  <Text isTruncated>{row?.MailAddress}</Text>
                </Td>
                <Td
                  maxW="25rem"
                  textAlign="right"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">
                    {row?.CompanyName ?? DEFAULT_EMPTY}
                  </Text>
                </Td>

                <Td
                  maxW="10.4rem"
                  isTruncated
                  textAlign="right"
                  px="0.8rem !important"
                >
                  {formatNumber(row?.CommissionRate ?? "0", 2, {
                    unit: "%",
                  })}
                </Td>

                <Td maxW="21.4rem">
                  <Button onClick={onClickBtnEdit(row)} mr="0.8rem">
                    編集
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

      {/* MODAL Edit Rate*/}
      <ModalAdmin
        modalW="md"
        isOpen={isOpen}
        onClose={onToggle}
        onClickRightButton={() => handleEditRecord()}
      >
        <Text fontSize="1.6rem" fontWeight="medium">
          手数料率を登録してください。
        </Text>
        <Text fontSize="1.2rem" fontWeight="medium">
          ※小数点2桁まで入力可能です。
        </Text>
        <Box mt="1.6rem">
          <Flex alignItems="center" justifyContent="flex-end" pr="3.2rem">
            <Text fontSize="1.6rem" fontWeight="medium" mr="1.6rem">
              プロバイダ名
            </Text>
            <Input maxW="25rem" h="4.8rem" value={rowSelect.Name} readOnly />
          </Flex>
          <Flex alignItems="center" mt="1.6rem" justifyContent="flex-end">
            <Text fontSize="1.6rem" fontWeight="medium" mr="1.6rem">
              手数料率
            </Text>

            <NumberInput
              outline="none"
              sx={{
                input: {
                  _focus: {
                    boxShadow: "inset 0 0 0.3rem 0.2rem rgba(0, 0, 0, 0.06)",
                    border: "1px solid var(--chakra-radii-none)",
                  },
                  fontWeight: "medium",
                  fontSize: "1.4rem",
                  outline: "none !important",
                  borderRadius: "none",
                  border: "1px solid var(--chakra-radii-none)",
                  textAlign: "right",
                  w: "15rem",
                  h: "4.8rem",
                  boxShadow: "inset 0 0 0.3rem 0.2rem rgba(0, 0, 0, 0.06)",
                },
              }}
              value={rowSelect.CommissionRate ?? ""}
              onChange={(val) => onChangeRate(val)}
              precision={2}
              min={0}
              max={100}
            >
              <NumberInputField />
            </NumberInput>
            <Text
              textAlign="center"
              w="3.2rem"
              fontSize="1.6rem"
              fontWeight="medium"
            >
              %
            </Text>
          </Flex>
        </Box>
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableCommissionRate
