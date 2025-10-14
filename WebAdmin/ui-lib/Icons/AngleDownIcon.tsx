import * as React from "react"
import { Icon, IconProps } from "@chakra-ui/react"

interface Props {
  color?: string
}

const AngleDownIcon = ({ color, css, ...rest }: Props & IconProps) => {
  return (
    <Icon fill="none" viewBox="0 0 16 16" {...rest}>
      <path
        d="M10 4L6 8L2 4"
        stroke={color ? color : "#959DA3"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export { AngleDownIcon }
