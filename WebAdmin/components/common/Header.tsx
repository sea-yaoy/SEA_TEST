import { Flex, Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"
import logo from "assets/images/logo.png"
import logo2 from "assets/images/logo2.png"
import Image from "next/image"

const Header = () => {
  return (
    <Flex
      bg="white"
      h="9rem"
      alignItems="center"
      // pl="2.4rem"
      boxShadow="0px 2px 2px rgb(0 0 0 / 8%)"
      zIndex={2}
      w="100%"
      position="relative"
      overflow="hidden"
    >
      <Link href={"/"}>
        <a>
          <Image src={logo2} alt="logo" width="250" height="250" />
        </a>
      </Link>
    </Flex>
  )
}

export default Header
