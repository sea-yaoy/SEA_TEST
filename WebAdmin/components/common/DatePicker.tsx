/* eslint-disable prettier/prettier */
import {
  Box,
  BoxProps,
  PlacementWithLogical,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react"
import React from "react"
import { DayPicker, Styles } from "react-day-picker"

interface Props {
  children: React.ReactNode
  onSelectDate: (date?: Date) => void
  selectDate: Date
  from?: string
  to?: string
  placementMenu?: PlacementWithLogical
}

const DatePicker = ({
  children,
  onSelectDate,
  selectDate,
  from,
  to,
  placementMenu = "top",
  ...rest
}: Props & BoxProps) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Popover
      isOpen={isOpen}
      onClose={onToggle}
      onOpen={onToggle}
      placement={placementMenu}
    >
      <PopoverTrigger>
        <Box {...rest}>{children}</Box>
      </PopoverTrigger>
      <PopoverContent
        w="100%"
        rounded="none"
        _focus={{ outline: "none" }}
        sx={{
          ".rdp-nav_button:hover": { backgroundColor: "#F8F9FA !important" },
          td: {
            "&:first-of-type button": {
              color: "red !important",
            },
            "&:last-of-type button": {
              color: "blue !important",
            },
            "button.rdp-day_outside": {
              pointerEvents: "none",
              color: "#D3D7D9 !important",
              "&:hover": {
                background: "none !important",
                cursor: "default !important",
              },
            },
            "button.rdp-day": {
              border: "0 !important",
              fontWeight: "medium",
              "&:hover": {
                backgroundColor: "#F8F9FA !important",
              },
              "&_selected": {
                background: "#F8F9FA",
                fontWeight: "bold",
              },
            },
          },
        }}
      >
        <DayPicker
          mode="single"
          selected={selectDate}
          onDayClick={onToggle}
          onSelect={onSelectDate}
          showOutsideDays
          disabled={{
            before: new Date(from ?? "0001/01/01"),
            after: new Date(to ?? "9999/12/31"),
          }}
          styles={customStyle}
        />
      </PopoverContent>
    </Popover>
  )
}

const customStyle: Styles = {
  day: {
    fontSize: "1.4rem",
    fontWeight: "medium" as any,
    borderRadius: "0",
    minWidth: "100%",
    height: "100%",
    color: "#636E77",
  },
  head_cell: {
    background: "#F9F9FA",
    fontSize: "1.4rem",
    minWidth: "4.8rem",
    height: "2.8rem",
    border: "1px solid #ECEDEE",
    textTransform: "capitalize",
    color: "#636E77",
  },
  caption: {
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    color: "#24282B",
    paddingBottom: "1rem",
    position: "relative",
  },
  nav: {
    width: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    border: "1px solid #ECEDEE",
    borderRadius: "0",
    height: "3.2rem",
    width: "3.2rem",
  },
  cell: {
    border: "1px solid #ECEDEE",
    height: "3.6rem",
  },
}

export default DatePicker
