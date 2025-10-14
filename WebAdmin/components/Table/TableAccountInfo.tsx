/* eslint-disable prettier/prettier */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Checkbox,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react"
import SelectInput from "components/common/SelectInput"
import ModalAdmin from "components/Modal/ModalAdmin"
import { AccountStatus, EMethodPayment, ScreenName } from "constants/enum"
import { IAccount } from "interfaces/models"
import { IUpdateAccountItemInfo } from "interfaces/request"
import React, { SetStateAction, useMemo, useState } from "react"
import { accountInfoService } from "services/accountInfo"
import { AngleDownIcon } from "ui-lib/Icons"
import { commonRequestData } from "utils/common"

interface Props {
  data: IAccount[]
  status: string | null
  setStatus: React.Dispatch<SetStateAction<string | null>>
  selectItem: string[]
  setSelectItem: React.Dispatch<SetStateAction<string[]>>
  updateItem: (data?: IModalValue) => void
}

interface IOption {
  label: string
  value: string
}

interface IModalValue {
  no?: string
  status?: string
  method?: string
}

const METHOD_OPTIONS = [
  { label: "クレカ払い", value: EMethodPayment.creditCard },
  { label: "請求書払い", value: EMethodPayment.bill },
]

const STATUS_OPTIONS = [
  { label: "利用中", value: AccountStatus.inUse },
  { label: "利用停止中", value: AccountStatus.suspended },
]

const TableAccountInfo = ({
  data,
  status,
  setStatus,
  selectItem,
  setSelectItem,
  updateItem,
}: Props) => {
  const { isOpen, onToggle } = useDisclosure()
  const [modalValue, setModalValue] = useState<IModalValue>()

  const isSelectAll = useMemo(
    () => selectItem.length === data.length && data.length > 0,
    [data.length, selectItem.length],
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
      setSelectItem(data?.map((item) => item.AccountNo as string))
    }
  }
  const onFilter = (filterStatus: string) => () => {
    setStatus(status === filterStatus ? null : filterStatus)
  }

  const handleClickDetail = (account: IAccount) => () => {
    setModalValue({
      no: account.AccountNo,
      status: account.AccountStatus,
      method: account.PaymentMethod,
    })
    onToggle()
  }

  const handleChangeModal = (key: keyof IModalValue) => (option: IOption) => {
    setModalValue({
      ...modalValue,
      [key]: option.value,
    })
  }

  const handleSaveModal = async () => {
    await accountInfoService
      .updateItem(
        commonRequestData(
          ScreenName.account,
          modalValue as any,
        ) as IUpdateAccountItemInfo,
      )
      .then((res) => {
        if (res.status === "success") {
          updateItem(modalValue)
          onToggle()
        }
      })
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem" overflow="hidden">
      <Table>
        <Thead>
          <Tr>
            <Th w="3.6rem">
              <Checkbox
                bg="white"
                isChecked={isSelectAll}
                onChange={onSelectAll}
                disabled={!data.length}
              />
            </Th>
            <Th w="30rem">メールアドレス</Th>
            <Th w="25rem">ユーザー名</Th>
            <Th w="18rem">支払方法</Th>
            <Th minW="13rem" pos="relative">
              <Popover>
                <PopoverTrigger>
                  <Box ml="-1.8rem">
                    ステータス
                    <Box
                      h="2.4rem"
                      w="2.4rem"
                      pos="absolute"
                      top="50%"
                      transform="translateY(-50%)"
                      right="0.8rem"
                      display="flex"
                    >
                      <AngleDownIcon
                        m="auto"
                        w="1.2rem"
                        h="1.2rem"
                        viewBox="0 0 12 12"
                      />
                    </Box>
                  </Box>
                </PopoverTrigger>
                <PopoverContent
                  ml="1.8rem"
                  _focus={{ outline: "none" }}
                  rounded="none"
                  border="1px solid #ECEDEE"
                >
                  <PopoverBody>
                    <Flex
                      h="3.2rem"
                      alignItems="center"
                      fontWeight="medium"
                      fontSize="1.6rem"
                      color="#636E77"
                    >
                      <Checkbox
                        bg="white"
                        mr="0.8rem"
                        isChecked={status === AccountStatus.inUse}
                        onChange={onFilter(AccountStatus.inUse)}
                      >
                        {STATUS_OPTIONS[0].label}
                      </Checkbox>
                    </Flex>
                    <Flex
                      h="3.2rem"
                      alignItems="center"
                      fontWeight="medium"
                      fontSize="1.6rem"
                      color="#636E77"
                    >
                      <Checkbox
                        bg="white"
                        mr="0.8rem"
                        isChecked={status === AccountStatus.suspended}
                        onChange={onFilter(AccountStatus.suspended)}
                      >
                        {STATUS_OPTIONS[1].label}
                      </Checkbox>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Th>
            <Th w="15rem" pos="relative" />
          </Tr>
        </Thead>
        <Tbody>
          {data.length ? (
            data?.map((row, i) => (
              <Tr key={i} h="3.6rem" w="100%">
                <Td>
                  <Checkbox
                    bg="white"
                    isChecked={selectItem.includes(row.AccountNo as string)}
                    onChange={onSelect(row.AccountNo as string)}
                  />
                </Td>
                <Td maxW="30rem" textAlign="left" whiteSpace="break-spaces">
                  <Text isTruncated>{row?.MailAddress}</Text>
                </Td>
                <Td maxW="25rem" textAlign="left" whiteSpace="break-spaces">
                  <Text isTruncated>{row?.Name}</Text>
                </Td>
                <Td>
                  {METHOD_OPTIONS[Number(row?.PaymentMethod ?? "0")].label}
                </Td>
                <Td>
                  {STATUS_OPTIONS[Number(row?.AccountStatus ?? "0")].label}
                </Td>
                <Td>
                  <Button onClick={handleClickDetail(row)}>編集</Button>
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
      <ModalAdmin
        modalW="md"
        isOpen={isOpen}
        onClose={onToggle}
        onClickRightButton={handleSaveModal}
      >
        <Flex alignItems="center" h="4.8rem">
          <Text fontSize="1.6rem" fontWeight="medium" w="15rem" color="#636E77">
            支払情報
          </Text>
          <SelectInput
            options={METHOD_OPTIONS}
            value={METHOD_OPTIONS[Number(modalValue?.method ?? "0")]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={handleChangeModal("method") as any}
          />
        </Flex>
        <Flex mt="1.6rem" alignItems="center" h="4.8rem" mb="1.6rem">
          <Text fontSize="1.6rem" fontWeight="medium" w="15rem" color="#636E77">
            ステータス
          </Text>
          <SelectInput
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS[Number(modalValue?.status ?? 0)]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={handleChangeModal("status") as any}
          />
        </Flex>
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableAccountInfo
