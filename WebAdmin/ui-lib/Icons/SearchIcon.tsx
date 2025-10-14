import * as React from "react"
import { Icon } from "@chakra-ui/react"

const SearchIcon = ({ ...props }) => {
  return (
    <Icon {...props}>
      <rect
        id="Rectangle_120"
        data-name="Rectangle 120"
        width="16"
        height="16"
        fill="none"
      />
      <path
        id="Path_254"
        data-name="Path 254"
        d="M370.985,354.969A3.984,3.984,0,1,0,367,350.985,3.984,3.984,0,0,0,370.985,354.969Zm0,2A5.984,5.984,0,1,0,365,350.985,5.984,5.984,0,0,0,370.985,356.969Z"
        transform="translate(-364.33 -344.328)"
        fill="#434b51"
        fillRule="evenodd"
      />
      <rect
        id="Rectangle_78"
        data-name="Rectangle 78"
        width="2"
        height="6"
        rx="1"
        transform="translate(9.673 11.086) rotate(-45)"
        fill="#434b51"
      />
    </Icon>
  )
}

export { SearchIcon }
