/* eslint-disable prettier/prettier */
import { Box, Divider, Flex, Text } from "@chakra-ui/react"
import React from "react"

const Footer = () => {
  return (
    <Box bg="#0a3e86" h="6rem" position="sticky">
      <Flex
        mx="auto"
        w="100%"
        maxW="98rem"
        h="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
        fontSize="1.2rem"
      >
        <Text>© aaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
        <Flex alignItems="center" h="1.2rem">
          <Text mx="1rem">あああああああああ</Text>
          <Divider orientation="vertical" />
          <Text mx="1rem">あああああああああ</Text>
          <Divider orientation="vertical" />
          <Text mx="1rem">あああああああああ</Text>
          <Divider orientation="vertical" />
          <Text mx="1rem">あああああああああ</Text>
        </Flex>
        {/* <Flex alignItems="center" h="1.2rem">
          <Link href="/notice">
            <a>
              <Text mx="1rem">Notice</Text>
            </a>
          </Link>
          <Divider orientation="vertical" />
          <Link href="/account-info">
            <a>
              <Text mx="1rem">Account Info</Text>
            </a>
          </Link>
          <Divider orientation="vertical" />
          <Link href="/api-provider">
            <a>
              <Text mx="1rem">API Provider</Text>
            </a>
          </Link>
          <Divider orientation="vertical" />
          <Link href="/paypee-info">
            <a>
              <Text mx="1rem">Paypee Info</Text>
            </a>
          </Link>
        </Flex> */}
        <Flex></Flex>
      </Flex>
    </Box>
  )
}

export default Footer
