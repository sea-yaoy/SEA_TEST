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
  Textarea,
  Box,
} from "@chakra-ui/react"
import React, { ChangeEvent, SetStateAction, useMemo, useState } from "react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { IAPIProvider } from "interfaces/models"
import { APIProviderStatus, ScreenName } from "constants/enum"
import { apiProviderService } from "services/apiProvider"
import { commonRequestData } from "utils/common"
import { IUpdateAPIProvider } from "interfaces/request"

interface Props {
  data: IAPIProvider[]
  updateData: React.Dispatch<SetStateAction<IAPIProvider[]>>
  getAPIProvider: () => void
}

const FORM_DATA = [
  {
    key: "CompanyName",
    label: "会社名",
  },
  {
    key: "DepartmentName",
    label: "部署名",
  },
  {
    key: "PicName",
    label: "ご担当者名（主）",
  },
  {
    key: "PicNameKana",
    label: "ご担当者名（主）（フリガナ）",
  },
  {
    key: "PicNameSub",
    label: "ご担当者名（副）",
  },
  {
    key: "PicNameKanaSub",
    label: "ご担当者名（副）（フリガナ）",
  },
  {
    key: "PostCode",
    label: "会社の郵便番号",
  },
  {
    key: "Address",
    label: "会社のご住所",
  },
  {
    key: "PhoneNumber",
    label: "会社の電話番号",
  },
  {
    key: "Email",
    label: "連絡先メールアドレス",
  },
  {
    key: "EmailSub",
    label: "連絡先メールアドレス（副）",
  },
]

const TableAPIProvider = ({ data, updateData, getAPIProvider }: Props) => {
  const { isOpen, onToggle } = useDisclosure()
  const [provider, setProvider] = useState<IAPIProvider>({})

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Text color="#FC121B" fontWeight="medium">
            申請中
          </Text>
        )
      case 1:
        return (
          <Text color="#FC121B" fontWeight="medium">
            審査中
          </Text>
        )
      case 2:
        return <Text>承認</Text>
      case 9:
        return <Text>否認</Text>

      default:
        break
    }
  }

  const handleOpenModal = (row: IAPIProvider) => () => {
    setProvider({
      ...row,
    })
    onToggle()
  }

  const onChangeComment =
    (key: "ScreeningComent" | "DecisionComment") =>
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setProvider({ ...provider, [key]: e.target.value })
    }

  const handleClickRightButton = (status?: number) => async () => {
    await apiProviderService
      .update(
        commonRequestData(ScreenName.provider, {
          screeningComment: provider.ScreeningComent ?? "",
          decisionComment: provider.DecisionComment ?? "",
          status: status ? status : Number(provider.Result) + 1,
          no: provider.AppNo ?? "",
        }) as IUpdateAPIProvider,
      )
      .then((res) => {
        if (res.status === "success") {
          getAPIProvider()
          onToggle()
        }
      })
  }

  const buttonRightText = useMemo(() => {
    switch (Number(provider.Result)) {
      case 0:
        return "承認"
      case 1:
        return "決裁"
      default:
        return undefined
    }
  }, [provider.Result])

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            <Th w="16rem">会社名</Th>
            <Th w="16rem">担当者名</Th>
            <Th w="12rem">ステータス</Th>
            <Th w="35rem">審査コメント</Th>
            <Th w="35rem">決裁コメント</Th>
            <Th minW="11.5rem"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length ? (
            data.map((row, i) => (
              <Tr key={i} h="3.6rem">
                <Td
                  maxW="16rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">{row.CompanyName}</Text>
                </Td>
                <Td
                  maxW="16rem"
                  textAlign="left"
                  px="0.8rem !important"
                  whiteSpace="break-spaces"
                >
                  <Text className="text-ellipsis">{row.PicName}</Text>
                </Td>
                <Td>{getStatusText(Number(row.Result))}</Td>
                <Td maxW="15rem" p="0">
                  <Box
                    px="0.8rem"
                    whiteSpace="break-spaces"
                    textAlign="left"
                    p="0.8rem"
                    maxH="10rem"
                    overflowY="auto"
                  >
                    {row.ScreeningComent}
                  </Box>
                </Td>
                <Td maxW="16rem" p="0">
                  <Box
                    px="0.8rem"
                    whiteSpace="break-spaces"
                    textAlign="left"
                    p="0.8rem"
                    maxH="10rem"
                    overflowY="auto"
                  >
                    {row.DecisionComment}
                  </Box>
                </Td>
                <Td>
                  <Button onClick={handleOpenModal(row)}>詳細</Button>
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
        isOpen={isOpen}
        onClose={onToggle}
        buttonLeftProps={
          Number(provider.Result) === 9 || Number(provider.Result) === 2
            ? { color: "#F9F9FA", bg: "#0d6efd" }
            : undefined
        }
        labelButtonLeft={
          Number(provider.Result) === 9 || Number(provider.Result) === 2
            ? "OK"
            : "キャンセル"
        }
        labelButtonRight="否認"
        labelButtonRightRight={buttonRightText}
        onClickRightButton={handleClickRightButton(9)}
        onClickRightRightButton={handleClickRightButton()}
        buttonRightProps={
          buttonRightText
            ? undefined
            : {
                display: "none",
              }
        }
      >
        {FORM_DATA.map((item) => (
          <Flex
            key={item.key}
            fontSize="1.6rem"
            fontWeight="medium"
            w="calc(100% - 6.4rem)"
            mx="3.2rem"
            py="1.2rem"
            alignItems="center"
            borderBottom="1px solid #ECEDEE"
          >
            <Text lineHeight="2.4rem" w="50%">
              {item.label}
            </Text>
            <Text lineHeight="2.4rem" w="50%">
              {provider[item.key as keyof IAPIProvider]}
            </Text>
          </Flex>
        ))}
        <Box mt="1.6rem" mx="1.6rem">
          <Text
            fontSize="1.6rem"
            fontWeight="medium"
            lineHeight="2.4rem"
            mb="0.8rem"
          >
            APIの提供計画など（どのようなAPIをいつごろ提供予定かなど）
          </Text>
          <Textarea
            color="#434B51"
            fontWeight="medium"
            fontSize="1.4rem"
            px="1.6rem"
            minW="45rem"
            minH="14.5rem"
            rounded="none"
            className="input-shadow"
            value={provider.DeliveryPlan}
            readOnly
            _readOnly={{
              boxShadow: "none",
              border: "1px solid #ECEDEE",
            }}
          />
        </Box>
        <Box mt="3.2rem">
          <Text
            mx="auto"
            color="#434B51"
            fontSize="2rem"
            fontWeight="medium"
            mb="0.8rem"
            w="fit-content"
          >
            審査コメント
          </Text>
          <Textarea
            color="#434B51"
            fontWeight="medium"
            fontSize="1.4rem"
            px="1.6rem"
            minW="45rem"
            minH="14.5rem"
            rounded="none"
            className="input-shadow"
            value={provider.ScreeningComent}
            onChange={onChangeComment("ScreeningComent")}
            readOnly={!!Number(provider.Result)}
            _readOnly={{
              boxShadow: "none",
              border: "1px solid #ECEDEE",
            }}
            autoFocus={Number(provider.Result) == 0}
          />
        </Box>
        {!!Number(provider.Result) && (
          <Box mt="1.6rem">
            <Text
              mx="auto"
              color="#434B51"
              fontSize="2rem"
              fontWeight="medium"
              w="fit-content"
              mb="0.8rem"
            >
              決裁コメント
            </Text>
            <Textarea
              color="#434B51"
              fontWeight="medium"
              fontSize="1.4rem"
              px="1.6rem"
              minW="45rem"
              minH="14.5rem"
              rounded="none"
              className="input-shadow"
              value={provider.DecisionComment}
              onChange={onChangeComment("DecisionComment")}
              readOnly={Number(provider.Result) > 1}
              autoFocus={Number(provider.Result) == 1}
              _readOnly={{
                boxShadow: "none",
                border: "1px solid #ECEDEE",
              }}
            />
          </Box>
        )}
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableAPIProvider
