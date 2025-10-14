import { Box, Flex, Text } from "@chakra-ui/react"
import { PAGE } from "constants/app"
import Link from "next/link"
import React from "react"

interface Props {
  namespace?: keyof typeof PAGE
}

const SidebarMenu = ({ namespace }: Props) => {
  return (
    <Box h="full" w="full">
      {Object.entries(PAGE).map((page) => (
        <Link href={`/${page[0]}`} key={page[0]}>
          <a>
            <Flex
              h="4.2rem"
              w="full"
              alignItems="center"
              px="0.8rem"
              borderBottom="1px solid #EDEDEE"
              bg={namespace === page[0] ? "#F9F9F9" : "#FFF"}
              cursor={namespace === page[0] ? "default" : "pointer"}
            >
              <Text
                isTruncated
                fontSize="1.6rem"
                fontWeight={namespace === page[0] ? "bold" : "medium"}
                color={namespace === page[0] ? "" : "#0D6EFD"}
              >
                {page[1].title}
              </Text>
            </Flex>
          </a>
        </Link>
      ))}
    </Box>
  )
}

export default SidebarMenu
