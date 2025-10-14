/* eslint-disable prettier/prettier */
import {
  Button,
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Flex,
  Text,
} from "@chakra-ui/react"
import { PureComponent } from "react"
import { createStandaloneToast } from "@chakra-ui/react"
import { IcCancleCircleIcon } from "ui-lib/Icons"

interface IProps {}
interface IState {
  isOpen: boolean
  message: string
}

class DialogModalError extends PureComponent<
  IProps & { ref: React.Ref<DialogModalError> },
  IState
> {
  state: IState = {
    isOpen: false,
    message: "",
  }
  toast = createStandaloneToast()

  showToast = (message?: string) => {
    this.toast.closeAll()
    setTimeout(() => {
      this.toast({
        position: "top",
        duration: 5000,
        isClosable: true,
        render: () => (
          <Flex
            mt="12rem"
            boxShadow="0px 0px 15px 2px rgb(0 0 0 / 15%)"
            bg="white"
            minH="49px"
            maxW="50rem"
            alignItems="center"
            padding="0 15px"
          >
            <Box w="1.6rem" h="1.6rem">
              <IcCancleCircleIcon w="1.6rem" h="1.6rem" />
            </Box>
            <Box flex={1}>
              <Text
                color="#636E77"
                fontSize="12px"
                fontWeight={400}
                textAlign="left"
                pl="2rem"
                position="relative"
                textTransform="capitalize"
              >
                {message}
              </Text>
            </Box>
          </Flex>
        ),
      })
    }, 0)
  }

  show = (message?: string) => {
    this.setState({
      message: message ?? "",
      isOpen: true,
    })
  }

  onSubmit = () => {
    // Router.push({ pathname: "/" })
    this.setState({
      ...this.state,
      isOpen: false,
    })
  }

  render = () => {
    const { isOpen, message } = this.state

    return (
      <>
        <Modal
          isCentered
          isOpen={isOpen}
          onClose={() => null}
          blockScrollOnMount={false}
        >
          <ModalOverlay />
          <ModalContent maxW="50rem" h="25rem">
            <ModalBody>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                h="100%"
              >
                <Box
                  textAlign="center"
                  fontSize="3rem"
                  color="red"
                  fontWeight="bold"
                >
                  {message ?? "Error"}
                </Box>
                <Box mt="3rem">
                  <Button
                    h="4rem"
                    minW="8rem"
                    fontSize="2rem"
                    color="#fff"
                    onClick={this.onSubmit}
                  >
                    OK
                  </Button>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export default DialogModalError
