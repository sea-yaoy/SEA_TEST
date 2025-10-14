/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  ButtonProps,
  Flex,
  Box,
  FlexProps,
} from "@chakra-ui/react"

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  labelButtonLeft?: string
  labelButtonRight?: string
  labelButtonRightRight?: string
  buttonLeftProps?: ButtonProps
  buttonRightProps?: ButtonProps
  buttonRightRightProps?: ButtonProps
  modalW?: "lg" | "md"
  onClickRightButton: () => void
  onClickRightRightButton?: () => void
  focusRef?: React.RefObject<HTMLInputElement>
  buttonMenuProps?: FlexProps
}

const ModalAdmin = ({
  children,
  isOpen,
  onClose,
  labelButtonLeft = "キャンセル",
  buttonLeftProps,
  labelButtonRight = "保存",
  labelButtonRightRight,
  modalW = "lg",
  onClickRightButton,
  onClickRightRightButton,
  buttonRightProps,
  buttonRightRightProps,
  buttonMenuProps,
  focusRef,
}: Props) => {
  const width = modalW === "lg" ? "91.2rem" : "55.3rem"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
      size="max"
      initialFocusRef={focusRef}
    >
      <ModalOverlay />
      <ModalContent w={width} maxH="calc(100% - 3.6rem)" my="0">
        <Box overflowY="auto">
          <Box p="4.2rem 4.8rem 0">{children}</Box>
          <Flex
            justifyContent="flex-end"
            p="3.2rem 4.8rem"
            {...buttonMenuProps}
          >
            <Button
              minW="12.8rem"
              onClick={onClose}
              bg="#F9F9FA"
              color="#0d6efd"
              {...buttonLeftProps}
            >
              {labelButtonLeft}
            </Button>
            <Button
              minW="12.8rem"
              ml="1.6rem"
              onClick={onClickRightButton}
              {...buttonRightProps}
            >
              {labelButtonRight}
            </Button>
            {labelButtonRightRight && (
              <Button
                minW="12.8rem"
                ml="1.6rem"
                onClick={onClickRightRightButton}
                {...buttonRightRightProps}
              >
                {labelButtonRightRight}
              </Button>
            )}
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default ModalAdmin
