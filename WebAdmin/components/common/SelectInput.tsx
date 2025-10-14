/* eslint-disable prettier/prettier */
import React from "react"
import Select, { CSSObjectWithLabel, Props, StylesConfig } from "react-select"

const SelectInput = ({ ...rest }: Props) => {
  const styles: StylesConfig = {
    container: (base: CSSObjectWithLabel) => ({
      ...base,
      width: "100%",
      height: "100%",
    }),
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      height: "100%",
      fontSize: "1.6rem",
      fontWeight: "500",
      color: "#636E77",
      borderRadius: "0",
      boxShadow: "inset 0 0 0.3rem 0.2rem rgba(0, 0, 0, 0.06)",
      borderColor: "#ECEDEE !important",
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: "1.6rem",
      fontWeight: "500",
      color: "var(--chakra-colors-gray-400)",
    }),
    option: (base: CSSObjectWithLabel, { isSelected }) => ({
      ...base,
      fontSize: "1.6rem",
      fontWeight: "500",
      color: isSelected ? "#FFF" : "#636E77",
    }),
    menuPortal: (base: CSSObjectWithLabel) => ({
      ...base,
      zIndex: 1500,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      color: "--chakra-colors-gray-400",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  }

  return (
    <Select
      menuPosition="fixed"
      isSearchable={false}
      options={rest.options}
      styles={styles}
      menuPortalTarget={
        typeof document != "undefined" ? document.body : undefined
      }
      {...rest}
    />
  )
}

export default SelectInput
