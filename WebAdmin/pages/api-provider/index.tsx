/* eslint-disable prettier/prettier */
import { Button, Flex, Input, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TableAPIProvider from "components/Table/TableAPIProvider"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Pagination } from "ui-lib/pagination"
import { SearchIcon } from "ui-lib/Icons"
import { IAPIProvider } from "interfaces/models"
import { apiProviderService } from "services/apiProvider"
import { cleanParams, commonRequestData } from "utils/common"
import { ScreenName } from "constants/enum"
import { IGetAllAPIProvider } from "interfaces/request"

const APIProviderPage = () => {
  const [apiProvider, setApiProvider] = useState<IAPIProvider[]>([])

  const [name, setName] = useState("")
  const [changePageName, setChangePageName] = useState("")

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })

  const getAPIProvider = async (page?: number, changePageName?: string) => {
    await apiProviderService
      .getAll(
        commonRequestData(
          ScreenName.provider,
          cleanParams({
            name: changePageName,
            p: page ? page : 1,
          }),
        ) as IGetAllAPIProvider,
      )
      .then((res) => {
        const { tableData, currentPage, totalPage } = res
        setApiProvider(tableData)
        setPagination({
          current: currentPage ?? 1,
          total: totalPage ?? 1,
        })
      })
  }

  useEffect(() => {
    getAPIProvider()
  }, [])

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSearch = () => {
    getAPIProvider(1, name)
    setChangePageName(name)
  }

  const onChangePagination = (page: number) => {
    getAPIProvider(page, changePageName)
  }

  return (
    <Layout namespace="api-provider">
      <Flex mt="2.4rem" w="fit-content">
        <Text
          w="20rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          担当者名検索​
        </Text>
        <Input
          placeholder="名前"
          mr="0.8rem"
          value={name}
          onChange={onChangeName}
        />
        <Button
          p="0"
          minW="3.4rem"
          h="3.4rem"
          w="3.4rem"
          bg="white"
          border="1px solid #ECEDEE"
          _focus={{
            outline: "none",
          }}
          onClick={handleSearch}
        >
          <SearchIcon viewBox="0 0 16 16" w="1.4rem" h="1.4rem" />
        </Button>
      </Flex>

      <TableAPIProvider
        getAPIProvider={getAPIProvider}
        data={apiProvider ?? []}
        updateData={setApiProvider}
      />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current}
        totalPages={pagination.total}
      />
    </Layout>
  )
}

export default APIProviderPage
