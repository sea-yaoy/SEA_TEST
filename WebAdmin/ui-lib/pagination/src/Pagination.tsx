// https://github.com/isaurssaurav/react-pagination
import {
  HStack,
  StackProps,
  Text,
  Button,
  ButtonProps,
  IconButton,
  Box,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import {
  AngleLeftToLineIcon,
  AngleRightMinLightIcon,
  CircleIcon,
} from "ui-lib/Icons"

interface Props {
  totalPages: number
  currentPage: number
  changeCurrentPage: (currentPage: number) => void
  activeButtonProps?: ButtonProps
  inactiveButtonProps?: ButtonProps
  spacing?: string
  transformTextButton?: string
}

const Pagination = ({
  totalPages,
  currentPage,
  changeCurrentPage,
  activeButtonProps,
  inactiveButtonProps,
  spacing,
  transformTextButton = "translateY(-0.1em)",
  ...styleProps
}: Props & StackProps) => {
  const [firstThreeArray, setFirstThreeArray] = useState([1, 2, 3, 4, 5])
  const [showLastEllipis, setShowLastEllipis] = useState(true)

  useEffect(() => {
    if (totalPages <= 5) {
      const fArray = []
      for (let i = 1; i <= totalPages; i++) {
        fArray.push(i)
      }
      setFirstThreeArray(fArray)
    } else {
      if (currentPage < 5) {
        setFirstThreeArray([1, 2, 3, 4, 5])
        setShowLastEllipis(true)
      } else {
        const fArray = []
        let index = 1
        for (let j = currentPage; j >= 0; j--) {
          fArray.push(j)
          if (index === 3) {
            break
          }
          index++
        }
        if (currentPage == totalPages - 1) {
          fArray.pop()
        }
        fArray.reverse()
        setFirstThreeArray(fArray)
        if (currentPage == totalPages - 1 || currentPage == totalPages) {
          setShowLastEllipis(false)
        } else {
          setShowLastEllipis(true)
        }
      }
    }
  }, [currentPage, totalPages])

  const first = () => {
    changeCurrentPage(1)
  }
  const prev = () => {
    if (currentPage > 1) {
      changeCurrentPage(currentPage - 1)
    }
  }
  const next = () => {
    if (currentPage < totalPages) {
      changeCurrentPage(currentPage + 1)
    }
  }
  const last = () => {
    changeCurrentPage(totalPages)
  }

  const showEllipsis = (showEllipis: boolean) => {
    return (
      showEllipis && (
        <Box px="0.2rem" transform="translateY(-0.2em)">
          <CircleIcon w="0.4rem" h="0.4rem" viewBox="0 0 4 4" mx="0.2rem" />
          <CircleIcon w="0.4rem" h="0.4rem" viewBox="0 0 4 4" mx="0.2rem" />
          <CircleIcon w="0.4rem" h="0.4rem" viewBox="0 0 4 4" mx="0.2rem" />
        </Box>
      )
    )
  }

  const isActive = (index: number) => {
    if (index == currentPage) {
      return true
    }

    return false
  }

  const createPagiButton = (pageNo: number) => {
    return (
      <Button
        key={pageNo}
        fontSize="1.4rem"
        fontWeight="medium"
        w="3.2rem"
        rounded="0.425rem"
        h="3.2rem"
        px="0"
        _focus={{ outline: "none" }}
        {...(isActive(pageNo)
          ? {
              pointerEvents: "none",
              color: "white",
              bg: "#0A3E86",
              ...activeButtonProps,
            }
          : {
              color: "#959DA3",
              bg: "white",
              border: "1px solid #EBEBEB",
              ...inactiveButtonProps,
            })}
        onClick={() => {
          changeCurrentPage(pageNo)
        }}
      >
        <Text transform={transformTextButton}>{pageNo}</Text>
      </Button>
    )
  }
  const showFirstPagi = () => {
    return !showLastEllipis && createPagiButton(1)
  }
  const showLastPagi = () => {
    if (currentPage !== totalPages) {
      return createPagiButton(totalPages)
    }
  }

  const showFirst = () => (
    <IconButton
      // disabled={currentPage === 1}
      bg={currentPage === 1 ? "#ECEDEE" : "white"}
      pointerEvents={currentPage === 1 ? "none" : "auto"}
      _focus={{ outline: "none" }}
      border="1px solid #EBEBEB"
      aria-label="btn-first"
      icon={
        <AngleLeftToLineIcon
          w="1.2rem"
          h="1.2rem"
          viewBox="0 0 12 12"
          color={
            inactiveButtonProps?.["color"] || currentPage === 1
              ? "white"
              : "#959DA3"
          }
        />
      }
      minW="3.2rem"
      minH="3.2rem"
      onClick={first}
    />
  )
  const showPrev = () => (
    <Box>
      <IconButton
        // disabled={currentPage === 1}
        bg={currentPage === 1 ? "#ECEDEE" : "white"}
        pointerEvents={currentPage === 1 ? "none" : "auto"}
        _focus={{ outline: "none" }}
        border="1px solid #EBEBEB"
        aria-label="btn-prev"
        icon={
          <AngleRightMinLightIcon
            w="1.2rem"
            h="1.2rem"
            viewBox="0 0 12 12"
            color={
              inactiveButtonProps?.["color"] || currentPage === 1
                ? "white"
                : "#959DA3"
            }
            transform="rotate(180deg)"
          />
        }
        minW="3.2rem"
        minH="3.2rem"
        mr="0.4rem"
        onClick={prev}
      />
    </Box>
  )

  const showNext = () => (
    <Box>
      <IconButton
        // disabled={currentPage === totalPages}
        bg={currentPage === totalPages ? "#ECEDEE" : "white"}
        pointerEvents={currentPage === totalPages ? "none" : "auto"}
        border="1px solid #EBEBEB"
        aria-label="btn-prev"
        _focus={{ outline: "none" }}
        icon={
          <AngleRightMinLightIcon
            w="1.2rem"
            h="1.2rem"
            viewBox="0 0 12 12"
            color={
              inactiveButtonProps?.["color"] || currentPage === totalPages
                ? "white"
                : "#959DA3"
            }
          />
        }
        minW="3.2rem"
        minH="3.2rem"
        ml="0.4rem"
        onClick={next}
      />
    </Box>
  )
  const showLast = () => (
    <IconButton
      // disabled={currentPage === totalPages}
      bg={currentPage === totalPages ? "#ECEDEE" : "white"}
      pointerEvents={currentPage === totalPages ? "none" : "auto"}
      _focus={{ outline: "none" }}
      border="1px solid #EBEBEB"
      aria-label="btn-prev"
      icon={
        <AngleLeftToLineIcon
          w="1.2rem"
          h="1.2rem"
          viewBox="0 0 12 12"
          color={
            inactiveButtonProps?.["color"] || currentPage === totalPages
              ? "white"
              : "#959DA3"
          }
          transform="rotate(180deg)"
        />
      }
      minW="3.2rem"
      minH="3.2rem"
      mx="0.4rem"
      onClick={last}
    />
  )

  return (
    <HStack
      spacing={"0.7rem" && spacing}
      alignItems="center"
      justifyContent="center"
      {...styleProps}
      // display={[0, 1].includes(totalPages) ? "none" : "flex"}
    >
      <>
        {showFirst()}
        {showPrev()}
        <HStack alignItems="center" justifyContent="center" spacing="0.4rem">
          <>
            {totalPages > 5 && (
              <>
                {showFirstPagi()}
                {showEllipsis(!showLastEllipis)}
              </>
            )}
            {firstThreeArray.map(createPagiButton)}
            {totalPages > 5 && (
              <>
                {showEllipsis(showLastEllipis)}
                {showLastPagi()}
              </>
            )}
          </>
        </HStack>
        {showNext()}
        {showLast()}
      </>
    </HStack>
  )
}

export { Pagination }
