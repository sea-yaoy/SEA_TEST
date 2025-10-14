import { Flex, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"

const Home = () => {
  return (
    <Layout>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Text as="span" m="0" lineHeight="1.15" fontSize="4rem">
          SBI ADMIN
        </Text>
      </Flex>
    </Layout>
  )
}

export default Home
