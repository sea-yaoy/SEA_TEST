import { Box, BoxProps, TextProps } from "@chakra-ui/react"
import { PAGE } from "constants/app"
import Head from "next/head"
import React, { ReactNode } from "react"
import Footer from "./Footer"
import Header from "./Header"
import SidebarMenu from "./SidebarMenu"

interface Props {
  children?: ReactNode
  title?: string
  namespace?: keyof typeof PAGE
  titleProps?: TextProps
  childProps?: BoxProps
  heading?: string
}

const Layout = ({ namespace, children, titleProps, childProps }: Props) => {
  const getTitle = (namespace?: string) => {
    if (namespace) {
      return PAGE[namespace as keyof typeof PAGE]?.title
    }

    return "SBI ADMIN"
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>{getTitle(namespace)}</title>
        <meta property="og:title" content={getTitle(namespace)} />
        <meta property="og:description" content="" />
      </Head>
      <Header />
      <Box id="body-container" as="main" {...childProps}>
        {/* Children */}
        <Box
          display="flex"
          justifyContent="center"
          h="100%"
          minH="calc(100vh - 9rem)"
        >
          <Box zIndex={1} w="27rem" bg="white">
            <SidebarMenu namespace={namespace} />
          </Box>
          <Box
            zIndex={1}
            bg="white"
            maxW="99.4rem"
            w="100%"
            borderLeft="1px solid #ECEDEE"
            p="5rem 3.2rem 3rem"
          >
            <Box mb="6rem" fontSize="2.4rem" fontWeight="bold" color="#24282B">
              {namespace && getTitle(namespace)}
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
