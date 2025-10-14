import React, { ChangeEvent, useEffect, useState } from "react"
import Layout from "components/common/Layout"
import { Button, Flex, Input, Text, useDisclosure } from "@chakra-ui/react"
import { SearchIcon } from "ui-lib/Icons"
import { commissionService } from "services/commissionRate"
import TableCommissionRate from "components/Table/TableCommissionRate"
import { ICommissionRate } from "interfaces/models"
import { commonRequestData } from "utils/common"
import { ScreenName } from "constants/enum"
import { IReqGetAllCommissionRate, IReqUpdate } from "interfaces/request"

const MaintainingFeePage = () => {
  const [searchMail, setSearchMail] = useState<string>()
  const [commissionRateList, setCommissionRateList] = useState<
    ICommissionRate[]
  >([])
  const { isOpen, onToggle } = useDisclosure()
  const [selections, setSelections] = useState<string[]>([])
  const [rowSelect, setRowSelect] = useState<ICommissionRate>({})

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchMail(e.target.value)
  }

  // Get list commission rate
  const getCommissionRate = async () => {
    const res = await commissionService.getCommissionFee(
      commonRequestData(ScreenName.commissionRate, {
        mail: searchMail as string,
      }) as IReqGetAllCommissionRate,
    )

    if (res?.tableData) setCommissionRateList(res.tableData ?? [])
  }

  const handleSearch = async () => {
    getCommissionRate()
  }

  const handleEdit = async () => {
    // Update data in db
    const { AccountNo, CommissionRate } = rowSelect

    if (!AccountNo || !CommissionRate) return
    const res = await commissionService.updateCommissionFee(
      commonRequestData(ScreenName.commissionRate, {
        AccountNo,
        CommissionRate,
      }) as IReqUpdate,
    )
    if (res.status === "success") {
      // Update list data in table
      const newData = commissionRateList.map((i) =>
        i.AccountNo === AccountNo ? { ...i, CommissionRate } : i,
      )

      setCommissionRateList(newData)
      onToggle()
    }
  }

  useEffect(() => {
    getCommissionRate()
  }, [])

  return (
    <Layout namespace="commission-rate">
      {/* Form search */}
      <Flex mt="2.4rem" w="fit-content">
        <Text
          minW="18rem"
          color="#434B51"
          lineHeight="3.6rem"
          fontSize="1.8rem"
          fontWeight="medium"
        >
          メールアドレス検索
        </Text>
        <Input
          textAlign="right"
          placeholder="メールアドレス"
          mr="0.8rem"
          value={searchMail}
          onChange={onChangeSearch}
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

      {/* Table show list data search */}
      <TableCommissionRate
        isOpen={isOpen}
        onToggle={onToggle}
        data={commissionRateList}
        selections={selections}
        setSelections={setSelections}
        rowSelect={rowSelect}
        setRowSelect={setRowSelect}
        onEditRecord={handleEdit}
      />
    </Layout>
  )
}

export default MaintainingFeePage
