/* eslint-disable prettier/prettier */
import {
  Box,
  Button,
  CSSObject,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { DEFAULT_EMPTY } from "constants/app"
import { isValid } from "date-fns"
import React, { useEffect, useState } from "react"
import { formatDate } from "utils/date"

interface Props {
  onSelectTime: (key: string, time?: string) => void
  selectTime: string
  name: string
  compareDate?: string
}

const css: CSSObject = {
  "::-webkit-scrollbar": {
    width: "0.4rem",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "#D6D6D6",
    borderRadius: "0.25rem",
  },
  overflowY: "auto",
  h: "28.6rem",
  w: "4.8rem",
  fontSize: "1.4rem",
  fontWeight: "medium",
  textAlign: "center",
}

const itemProps = {
  py: "0.4rem",
  w: "100%",
  fontSize: "1.4rem",
  verticalAlign: "center",
  _hover: {
    bg: "#ECEDEE",
  },
}

const TimePicker = ({ onSelectTime, selectTime, name, compareDate }: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  const getDefaultValue = (data: string, type: string) => {
    const val = formatDate(data, type)
    if (val === DEFAULT_EMPTY) {
      return "00"
    }

    return val
  }

  const [selectVal, setSelectVal] = useState({
    h: getDefaultValue(selectTime, "HH"),
    m: getDefaultValue(selectTime, "mm"),
  })

  const getTime = (val: Date | string) => {
    const _val = formatDate(val, "HH:mm")

    if (_val === DEFAULT_EMPTY) return "00:00"

    return _val
  }

  const onSelectVal = (key: string, val: string) => () => {
    if (isDisable(key, Number(val))) return
    setSelectVal((prev) => ({
      ...prev,
      [key]: val,
    }))
  }

  const onUpdateTime = () => {
    if (selectTime === "") return
    const val = selectTime.split(" ")
    val[1] = `${selectVal.h}:${selectVal.m}:00`

    onSelectTime(name, isValid(new Date(val.join(" "))) ? val.join(" ") : "")
    onToggle()
  }

  const onFocusItem = (key: string, id: string) => {
    const container = document.getElementById(`${name}-${key}`)
    container
      ?.getElementsByClassName(`${name}-${key}-${id}`)?.[0]
      ?.scrollIntoView()
  }

  useEffect(() => {
    if (isOpen) {
      const time = {
        h: getDefaultValue(selectTime, "HH"),
        m: getDefaultValue(selectTime, "mm"),
      }
      if (time.h !== selectVal.h || time.m !== selectVal.m) {
        setSelectVal({
          ...time,
        })
      }

      onFocusItem("hours", time.h)
      onFocusItem("minutes", time.m)
    }
  }, [isOpen])

  useEffect(() => {
    if (selectVal.h && selectVal.m) {
    }
  }, [selectTime])

  const isHasVal = selectTime !== ""

  const isDisable = (type: string, val: number) => {
    if (
      formatDate(selectTime, "YYYY/MM/DD") !==
      formatDate(compareDate, "YYYY/MM/DD")
    )
      return undefined

    const disable = {
      _hover: {
        bg: "#ECEDEE",
      },
      opacity: 0.5,
      bg: "#ECEDEE",
    }

    switch (`${name}-${type}`) {
      case "PeriodEndDate-h":
        if (Number(getDefaultValue(compareDate ?? "", "HH")) <= val)
          return undefined

        return disable
      case "PeriodEndDate-m":
        if (Number(getDefaultValue(compareDate ?? "", "mm")) <= val)
          return undefined

        return disable
      case "PeriodStartDate-h":
        if (Number(getDefaultValue(compareDate ?? "", "HH")) >= val)
          return undefined

        return disable
      case "PeriodStartDate-m":
        if (Number(getDefaultValue(compareDate ?? "", "mm")) >= val)
          return undefined

        return disable
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={onToggle}
      onOpen={isHasVal ? onToggle : undefined}
      placement="top"
    >
      <PopoverTrigger>
        <Flex
          pointerEvents={isHasVal ? "auto" : "none"}
          cursor="pointer"
          alignItems="center"
          px="1.6rem"
          fontSize="1.4rem"
          fontWeight="medium"
          h="4.8rem"
          w="100%"
          boxShadow="inset 0 0 0.3rem 0.2rem rgba(0, 0, 0, 0.06)"
        >
          <Text w="100%" textAlign="center">
            {isHasVal && getTime(selectTime ?? "")}
          </Text>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="100%" rounded="none" _focus={{ outline: "none" }}>
        <Flex>
          <Box sx={css} id={`${name}-hours`}>
            {[...Array(24)].map((item, i) => (
              <Box
                key={i}
                className={`${name}-hours-${i.toString().padStart(2, "0")}`}
                {...itemProps}
                bg={
                  selectVal.h === i.toString().padStart(2, "0") ? "#ECEDEE" : ""
                }
                onClick={onSelectVal("h", i.toString().padStart(2, "0"))}
                {...isDisable("h", i)}
              >
                {i}
              </Box>
            ))}
          </Box>
          <Box sx={css} id={`${name}-minutes`}>
            {[...Array(60)].map((item, i) => (
              <Box
                key={i}
                className={`${name}-minutes-${i.toString().padStart(2, "0")}`}
                borderLeft="1px solid #ECEDEE"
                {...itemProps}
                bg={
                  selectVal.m === i.toString().padStart(2, "0") ? "#ECEDEE" : ""
                }
                onClick={onSelectVal("m", i.toString().padStart(2, "0"))}
                {...isDisable("m", i)}
              >
                {i.toString().padStart(2, "0")}
              </Box>
            ))}
          </Box>
        </Flex>
        <Flex borderTop="1px solid #ECEDEE" w="100%" justifyContent="flex-end">
          <Button
            h="2.4rem"
            px="1.2rem"
            m="0.4rem 0.2rem 0.2rem"
            fontSize="1.4rem"
            onClick={onUpdateTime}
          >
            OK
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

export default TimePicker
