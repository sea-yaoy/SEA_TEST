/* eslint-disable prettier/prettier */
import { Button, Flex, Input, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TablePayeeInfo from "components/Table/TablePayeeInfo"
import React, { useEffect, useState } from "react"
import { Pagination } from "ui-lib/pagination"
import { SearchIcon } from "ui-lib/Icons"
import { IPaypeeInfo } from "interfaces/models"
import { cleanParams, commonRequestData } from "utils/common"
import { paypeeInfoService } from "services/paypeeInfo"
import { ScreenName } from "constants/enum"
import { IGetAllPaypeeInfo } from "interfaces/request"

const PaypeeInfoPage = () => {
  const [paypeeInfo, setPaypeeInfo] = useState<IPaypeeInfo[]>([])

  const [mail, setMail] = useState("")
  const [changePageMail, setChangePageMail] = useState("")

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  })

  const getPaypeeInfo = async (page?: number, changePageMail?: string) => {
    await paypeeInfoService
      .getAll(
        commonRequestData(
          ScreenName.paypee,
          cleanParams({
            mail: changePageMail,
            p: page ? page : 1,
          }),
        ) as IGetAllPaypeeInfo,
      )
      .then((res) => {
        const { tableData, currentPage, totalPage } = res
        setPaypeeInfo(tableData)
        setPagination({
          current: currentPage ?? 1,
          total: totalPage ?? 1,
        })
      })
  }

  useEffect(() => {
    getPaypeeInfo()
  }, [])

  const onChangeMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail(e.target.value)
  }

  const handleSearch = () => {
    getPaypeeInfo(1, mail)
    setChangePageMail(mail)
  }

  const onChangePagination = (page: number) => {
    getPaypeeInfo(page, changePageMail)
  }

  return (
    <Layout namespace="paypee-info">
      <Flex mt="2.4rem" w="fit-content">
        <Text
          w="30rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          メールアドレス検索​
        </Text>
        <Input
          placeholder="メールアドレス"
          mr="0.8rem"
          h="3.6rem"
          rounded="none"
          className="input-shadow"
          fontSize="1.4rem"
          value={mail}
          onChange={onChangeMail}
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

      <TablePayeeInfo data={paypeeInfo ?? []} updateData={setPaypeeInfo} />

      <Pagination
        changeCurrentPage={onChangePagination}
        currentPage={pagination.current}
        totalPages={pagination.total}
      />
    </Layout>
  )
}

export default PaypeeInfoPage
