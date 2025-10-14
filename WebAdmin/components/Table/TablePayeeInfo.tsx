/* eslint-disable prettier/prettier */
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
} from "@chakra-ui/react"
import React, { ChangeEvent, useState, useRef, SetStateAction } from "react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { IPaypeeInfo } from "interfaces/models"
import { paypeeInfoService } from "services/paypeeInfo"
import { commonRequestData } from "utils/common"
import { ScreenName } from "constants/enum"
import {
  IAddPaypeeInfo,
  IDeletePaypeeInfo,
  IUpdatePaypeeInfo,
} from "interfaces/request"

interface IInfo {
  no?: string
  name?: string
  mail?: string
  code?: string
}

const DEFAULT_VALUE: IInfo = {
  no: "",
  name: "",
  mail: "",
  code: "",
}

enum ActionMode {
  add = 0,
  update = 1,
  delete = 2,
}

const MODE = ["登録", "変更", "削除"] // 0: 登録, 1: 変更, 2:削除

interface Props {
  data: IPaypeeInfo[]
  updateData: React.Dispatch<SetStateAction<IPaypeeInfo[]>>
}

const TablePaymentInfo = ({ data, updateData }: Props) => {
  const { isOpen, onToggle } = useDisclosure()
  const [info, setInfo] = useState<IInfo>(DEFAULT_VALUE)
  const [mode, setMode] = useState<number>(ActionMode.add)

  const inputCodeRef = useRef<HTMLInputElement>(null)

  const handleOpenModal = (mode: number, row?: IInfo) => () => {
    setInfo({ ...DEFAULT_VALUE, ...row })
    setMode(mode)
    onToggle()
  }

  const onChangeInfo =
    (key: keyof IInfo) => (e: ChangeEvent<HTMLInputElement>) => {
      if (key === "mail") return
      setInfo((prev) => {
        return { ...prev, [key]: e.target.value }
      })
    }

  const handleClickRightButton = async () => {
    switch (mode) {
      case ActionMode.add:
        await paypeeInfoService
          .add(
            commonRequestData(ScreenName.paypee, {
              no: info.no ?? "",
              code: info.code ?? "",
            }) as IAddPaypeeInfo,
          )
          .then((res) => {
            if (res.status === "success") {
              updateData(
                data.map((item) => {
                  if (item.AccountNo === info.no)
                    return { ...item, PayeeCode: info.code }

                  return item
                }),
              )
              onToggle()
            }
          })
        break
      case ActionMode.delete:
        await paypeeInfoService
          .delete(
            commonRequestData(ScreenName.paypee, {
              no: info.no ?? "",
            }) as IDeletePaypeeInfo,
          )
          .then((res) => {
            if (res.status === "success") {
              updateData(
                data.map((item) => {
                  if (item.AccountNo === info.no) {
                    return { ...item, PayeeCode: undefined }
                  }

                  return item
                }),
              )
              onToggle()
            }
          })
        break
      default:
        await paypeeInfoService
          .update(
            commonRequestData(ScreenName.paypee, {
              no: info.no ?? "",
              code: info.code ?? "",
            }) as IUpdatePaypeeInfo,
          )
          .then((res) => {
            if (res.status === "success") {
              updateData(
                data.map((item) => {
                  if (item.AccountNo === info.no)
                    return { ...item, PayeeCode: info.code }

                  return item
                }),
              )
              onToggle()
            }
          })
    }
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            <Th w="25rem">メールアドレス</Th>
            <Th w="25rem">会社名</Th>
            <Th w="21.4rem">支払先コード</Th>
            <Th w="21.4rem">登録・変更・削除</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length ? (
            data.map((row, i) => (
              <Tr key={i} h="3.6rem">
                <Td
                  maxW="25rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis"> {row.Email}</Text>
                </Td>
                <Td
                  maxW="25rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">{row.CompanyName}</Text>
                </Td>

                <Td
                  maxW="21.4rem"
                  isTruncated
                  textAlign="right"
                  px="0.8rem !important"
                >
                  {row.PayeeCode}
                </Td>
                <Td maxW="21.4rem">
                  {!row.PayeeCode ? (
                    <Button
                      onClick={handleOpenModal(ActionMode.add, {
                        no: row.AccountNo,
                        mail: row.MailAddress,
                        name: row.CompanyName,
                      })}
                    >
                      登録
                    </Button>
                  ) : (
                    <>
                      <Button
                        mr="0.8rem"
                        onClick={handleOpenModal(ActionMode.update, {
                          no: row.AccountNo,
                          mail: row.MailAddress,
                          name: row.CompanyName,
                          code: row.PayeeCode,
                        })}
                      >
                        変更
                      </Button>
                      <Button
                        variant="delete"
                        onClick={handleOpenModal(ActionMode.delete, {
                          no: row.AccountNo,
                        })}
                      >
                        削除
                      </Button>
                    </>
                  )}
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
      <ModalAdmin
        isOpen={isOpen}
        onClose={onToggle}
        labelButtonRight={MODE[mode]}
        buttonRightProps={{
          disabled:
            mode !== ActionMode.delete &&
            info.code ===
              data.find((item) => item.AccountNo === info.no)?.PayeeCode,
        }}
        modalW="md"
        onClickRightButton={handleClickRightButton}
        focusRef={inputCodeRef}
      >
        {mode !== ActionMode.delete ? (
          <>
            <Flex>
              <Text
                color="#434B51"
                fontSize="1.6rem"
                fontWeight="medium"
                w="12rem"
                minW="12rem"
              >
                会社名
              </Text>
              <Input
                color="#434B51"
                fontWeight="medium"
                fontSize="1.4rem"
                px="1.6rem"
                minW="15rem"
                rounded="none"
                className="input-shadow"
                h="4.8rem"
                value={info.name}
                onChange={onChangeInfo("name")}
                readOnly
              />
            </Flex>
            <Flex mt="1.6rem">
              <Text
                color="#434B51"
                fontSize="1.6rem"
                fontWeight="medium"
                w="12rem"
                minW="12rem"
              >
                支払先コード
              </Text>
              <Input
                color="#434B51"
                fontWeight="medium"
                fontSize="1.4rem"
                px="1.6rem"
                minW="15rem"
                rounded="none"
                className="input-shadow"
                h="4.8rem"
                value={info.code}
                onChange={onChangeInfo("code")}
                ref={inputCodeRef}
                maxLength={10}
              />
            </Flex>
          </>
        ) : (
          <Text
            textAlign="center"
            py="2rem"
            color="#434B51"
            fontSize="1.6rem"
            fontWeight="medium"
          >
            支払先コードを削除しますがよろしいですか？
          </Text>
        )}
      </ModalAdmin>
    </TableContainer>
  )
}

export default TablePaymentInfo
