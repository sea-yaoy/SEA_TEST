import * as React from "react"
import { Icon, IconProps } from "@chakra-ui/react"

interface Props extends IconProps {
  color?: string
}

const IcCancleCircleIcon = ({ color = "#fc121b", css, ...props }: Props) => {
  return (
    <Icon width="16px" height="16px" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        id="Subtraction_7"
        data-name="Subtraction 7"
        d="M21391-7884a8.009,8.009,0,0,1-8-8,8.009,8.009,0,0,1,8-8,8.011,8.011,0,0,1,8,8A8.011,8.011,0,0,1,21391-7884Zm0-6.939h0l2.293,2.292,1.064-1.058-2.3-2.3,2.3-2.3-1.064-1.058-2.293,2.293-2.3-2.293-1.059,1.058,2.3,2.3-2.3,2.3,1.059,1.058,2.3-2.292Z"
        transform="translate(-21383.002 7900.001)"
        fill={color}
      />
    </Icon>
  )
}

export { IcCancleCircleIcon }
