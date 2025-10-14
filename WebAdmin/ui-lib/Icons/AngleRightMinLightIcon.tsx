import { Icon, IconProps } from "@chakra-ui/react"
import * as React from "react"

const AngleRightMinLightIcon = ({
  color,
  css,
  ...props
}: {
  color: string
} & IconProps) => {
  return (
    <Icon {...props}>
      <g id="angle-right-min-light">
        <rect
          id="Rectangle_105"
          data-name="Rectangle 105"
          width="12"
          height="12"
          fill="none"
        />
        <path
          id="Path_309"
          data-name="Path 309"
          d="M56,110l4,4-4,4"
          transform="translate(-52 -108)"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>
    </Icon>
  )
}

export { AngleRightMinLightIcon }
