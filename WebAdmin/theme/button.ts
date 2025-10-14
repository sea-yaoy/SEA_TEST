export const buttonStyle = {
  baseStyle: {
    fontSize: "1.6rem",
    h: "3.2rem",
    px: "2.4rem",
    bgColor: "#0D6EFD",
    color: "#FFF",
    _hover: {
      opacity: 0.6,
      bg: "gray.200",
      _disabled: {
        bg: "#ECEDEE",
      },
    },
    _disabled: {
      bg: "#ECEDEE",
      opacity: 1,
      _hover: {
        opacity: 1,
      },
    },
  },
  defaultProps: {
    variant: "default",
    size: "default",
  },
  sizes: {
    default: {
      fontSize: "1.6rem",
      fontWeight: "medium",
    },
  },
  variants: {
    default: {
      bgColor: "#0D6EFD",
      color: "#FFF",
    },
    delete: {
      color: "#FC121B",
      bg: "#F9F9FA",
    },
    cancel: {
      color: "#0D6EFD",
      bg: "#F9F9FA",
    },
  },
}
