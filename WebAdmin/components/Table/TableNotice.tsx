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
  Textarea,
  Flex,
  Input,
  Text,
  Box,
} from "@chakra-ui/react"
import React, { useEffect, useMemo, useState } from "react"
import ModalAdmin from "components/Modal/ModalAdmin"
import { INotice } from "interfaces/models"
import { formatDate } from "utils/date"
import { noticeService } from "services/notice"
import DatePicker from "components/common/DatePicker"
import { commonRequestData, compareObject } from "utils/common"
import { IAddNotice, IUpdateNotice } from "interfaces/request"
import { ScreenName } from "constants/enum"
import { DEFAULT_EMPTY } from "constants/app"
import TimePicker from "components/common/TimePicker"

interface Props {
  isOpen: boolean
  onToggle: () => void
  data: INotice[]
  updateData: () => void
  deleteData: (no: string) => () => void
}

const _YYYY_MM_DD = "YYYY-MM-DD HH:mm:ss"
const YYYY_MM_DD = "YYYY/MM/DD HH:mm:ss"
const YYYY_MM_DD_HH_mm = "YYYY/MM/DD HH:mm"

const DEFAULT_VALUE: INotice = {
  NotificationNo: "",
  Contents: "",
  PeriodStartDate: "",
  PeriodEndDate: "",
}

const TableNotice = ({
  isOpen,
  onToggle,
  data,
  updateData,
  deleteData,
}: Props) => {
  const [notice, setNotice] = useState<INotice>(DEFAULT_VALUE)
  const [currentDate, setCurrentDate] = useState(
    formatDate(new Date(), "YYYY/MM/DD HH:mm:00"),
  )
  const handleEdit = (row: INotice) => () => {
    setNotice({
      ...row,
      PeriodStartDate: row.PeriodStartDate
        ? formatDate(row.PeriodStartDate, YYYY_MM_DD)
        : "",
      PeriodEndDate: row.PeriodEndDate
        ? formatDate(row.PeriodEndDate, YYYY_MM_DD)
        : "",
    })
    onToggle()
  }

  useEffect(() => {
    if (isOpen && notice.NotificationNo === "") {
      const _currentDate = formatDate(new Date(), "YYYY/MM/DD HH:mm:00")
      setCurrentDate(_currentDate)
      setNotice((row) => ({
        ...row,
        PeriodStartDate: _currentDate,
      }))
    }
  }, [isOpen])

  const onClose = () => {
    setNotice(DEFAULT_VALUE)
    onToggle()
  }

  const isDisableButton = useMemo(() => {
    if (
      notice.PeriodEndDate === "" ||
      notice.PeriodStartDate === "" ||
      notice.Contents === ""
    )
      return true

    let oldNotice = data.find(
      (item) => item.NotificationNo === notice.NotificationNo,
    )

    oldNotice = {
      ...oldNotice,
      PeriodStartDate: oldNotice?.PeriodStartDate
        ? formatDate(oldNotice?.PeriodStartDate, YYYY_MM_DD)
        : "",
      PeriodEndDate: oldNotice?.PeriodEndDate
        ? formatDate(oldNotice?.PeriodEndDate, YYYY_MM_DD)
        : "",
    }

    return compareObject(oldNotice, notice)
  }, [notice])

  const onSelectTime = (name: string, val?: string) => {
    setNotice((prev) => ({
      ...prev,
      [name as keyof INotice]: val ?? "",
    }))
  }

  const onChangeNotice =
    (key: keyof INotice) =>
    (e: React.ChangeEvent<HTMLTextAreaElement> | Date | undefined) => {
      if (key === "Contents") {
        setNotice((prev) => {
          return {
            ...prev,
            Contents: (e as React.ChangeEvent<HTMLTextAreaElement>).target
              .value,
          }
        })
      } else {
        let date = ""
        if (e) {
          const val = formatDate(e as Date, YYYY_MM_DD).split(" ")
          val[1] = formatDate(notice?.[key], "HH:mm:ss")
          date = val.join(" ")
          if (date.at(-1) === DEFAULT_EMPTY)
            date = date.replace(DEFAULT_EMPTY, "00:00:00")
        }

        if (
          key === "PeriodEndDate" &&
          notice.PeriodEndDate === "" &&
          formatDate(date, "YYYY/MM/DD") ===
            formatDate(notice.PeriodStartDate, "YYYY/MM/DD")
        ) {
          date = notice.PeriodStartDate ?? ""
        }

        setNotice((prev) => {
          return {
            ...prev,
            [key]: date,
          }
        })
      }
    }

  const handleAddOrEdit = async () => {
    let mode = "update"
    const { NotificationNo, Contents, PeriodStartDate, PeriodEndDate } = notice
    const params = {
      no: NotificationNo as string,
      content: Contents ?? "",
      startDate: formatDate(PeriodStartDate, _YYYY_MM_DD),
      endDate: formatDate(PeriodEndDate, _YYYY_MM_DD),
    }

    if (notice.NotificationNo === "") {
      mode = "add"
      const { no, ...addParams } = params
      await noticeService
        .add(commonRequestData(ScreenName.notice, addParams) as IAddNotice)
        .then((res) => {
          if (res.status === "success") {
            updateData()
            onClose()
          }
        })
    } else {
      await noticeService
        .update(commonRequestData(ScreenName.notice, params) as IUpdateNotice)
        .then((res) => {
          if (res.status === "success") {
            updateData()
            onClose()
          }
        })
    }
  }

  return (
    <TableContainer mt="1.6rem" pb="3rem">
      <Table>
        <Thead>
          <Tr>
            <Th rowSpan={2} w="50rem">
              内容
            </Th>
            <Th colSpan={2} w="12rem">
              掲載期間
            </Th>
            <Th rowSpan={2} w="12rem"></Th>
          </Tr>
          <Tr>
            <Th>開始</Th>
            <Th>終了</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length ? (
            data.map((row, i) => (
              <Tr key={i} h="5.6rem">
                <Td maxW="42rem" p="0">
                  <Box
                    whiteSpace="break-spaces"
                    textAlign="left"
                    p="0.8rem"
                    maxH="22rem"
                    overflowY="auto"
                  >
                    {row.Contents}
                  </Box>
                </Td>
                <Td maxH="30rem">
                  {formatDate(row.PeriodStartDate, YYYY_MM_DD_HH_mm)}
                </Td>
                <Td maxH="30rem">
                  {formatDate(row.PeriodEndDate, YYYY_MM_DD_HH_mm)}
                </Td>
                <Td maxH="30rem">
                  <Button mr="0.8rem" onClick={handleEdit(row)}>
                    編集
                  </Button>
                  <Button
                    variant="delete"
                    onClick={deleteData(row.NotificationNo as string)}
                  >
                    削除
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr w="100%">
              <Td colSpan={4} p={0} border="none">
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
        onClose={onClose}
        buttonRightProps={{
          disabled: isDisableButton,
        }}
        onClickRightButton={handleAddOrEdit}
      >
        <Flex>
          <Text
            color="#434B51"
            fontSize="1.6rem"
            fontWeight="medium"
            w="12rem"
            minW="12rem"
          >
            内容
          </Text>
          <Textarea
            minW="45rem"
            minH="14.5rem"
            value={notice.Contents}
            onChange={onChangeNotice("Contents")}
          />
        </Flex>
        {/* DatePicker */}
        <Flex mt="3.2rem" justifyContent="space-between">
          <Flex w="48%" mr="0.8rem" alignItems="center">
            <Text
              color="#434B51"
              fontSize="1.6rem"
              fontWeight="medium"
              w="12rem"
              minW="12rem"
            >
              掲載開始日
            </Text>
            <Flex w="100%" minW="27rem">
              <DatePicker
                from={formatDate(currentDate, "YYYY/MM/DD")}
                selectDate={new Date(notice.PeriodStartDate ?? "")}
                onSelectDate={onChangeNotice("PeriodStartDate")}
                to={formatDate(notice.PeriodEndDate, "YYYY/MM/DD")}
              >
                <Input
                  readOnly
                  cursor="pointer"
                  minW="18rem"
                  h="4.8rem"
                  _selection={{
                    bg: "none",
                  }}
                  value={
                    notice.PeriodStartDate !== ""
                      ? formatDate(notice.PeriodStartDate, "YYYY/MM/DD")
                      : ""
                  }
                />
              </DatePicker>
              <TimePicker
                compareDate={formatDate(notice.PeriodEndDate, YYYY_MM_DD_HH_mm)}
                name="PeriodStartDate"
                onSelectTime={onSelectTime}
                selectTime={notice.PeriodStartDate ?? ""}
              />
            </Flex>
          </Flex>
          <Flex w="48%" alignItems="center">
            <Text
              color="#434B51"
              fontSize="1.6rem"
              fontWeight="medium"
              w="12rem"
              minW="12rem"
            >
              掲載終了日
            </Text>
            <Flex w="100%" minW="27rem">
              <DatePicker
                selectDate={new Date(notice.PeriodEndDate ?? "")}
                onSelectDate={onChangeNotice("PeriodEndDate")}
                from={formatDate(notice.PeriodStartDate, "YYYY/MM/DD")}
              >
                <Input
                  readOnly
                  cursor="pointer"
                  minW="18rem"
                  h="4.8rem"
                  _selection={{
                    bg: "none",
                  }}
                  value={
                    notice.PeriodEndDate !== ""
                      ? formatDate(notice.PeriodEndDate, "YYYY/MM/DD")
                      : ""
                  }
                />
              </DatePicker>
              <TimePicker
                compareDate={formatDate(
                  notice.PeriodStartDate,
                  YYYY_MM_DD_HH_mm,
                )}
                name="PeriodEndDate"
                onSelectTime={onSelectTime}
                selectTime={notice.PeriodEndDate ?? ""}
              />
            </Flex>
          </Flex>
        </Flex>
      </ModalAdmin>
    </TableContainer>
  )
}

export default TableNotice
