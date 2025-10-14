import { Icon, IconProps } from "@chakra-ui/react"
import React from "react"

interface Props extends IconProps {
  color: string
}
const AngleLeftToLineIcon = ({ color, css, ...props }: Props) => {
  return (
    <Icon {...props}>
      <g id="angleLeft-toLine">
        <rect
          id="Rectangle_106"
          data-name="Rectangle 106"
          width="12"
          height="12"
          fill="none"
        />
        <g id="Group_192" data-name="Group 192" transform="translate(-1 -1)">
          <path
            id="Path_310"
            data-name="Path 310"
            d="M92.5,109l-4,4,4,4"
            transform="translate(-81.5 -106)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="2"
          />
          <line
            id="Line_1"
            data-name="Line 1"
            y2="8"
            transform="translate(4 3)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      </g>
    </Icon>
  )
}

export { AngleLeftToLineIcon }
