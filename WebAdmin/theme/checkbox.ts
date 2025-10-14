/* eslint-disable prettier/prettier */
export const checkboxStyle = {
  defaultProps: {
    variant: "default",
    size: "default",
  },
  sizes: {
    default: {
      icon: {
        maxW: "1rem ",
        h: "1rem",
      },
    },
  },
  variants: {
    default: {
      icon: {
        backgroundColor: "#d7e7fe",
        borderColor: "#d7e7fe",
        color: "#0d6efd",
        maxW: "1rem ",
        h: "1rem",
      },
      control: {
        width: "1.6rem",
        height: "1.6rem",
        border: "0.5px solid #d3d7d9",
        boxShadow: "none !important",
        "&[data-checked]": {
          borderColor: "#d7e7fe",
          bgColor: "#d7e7fe",
        },
        "&[data-checked][data-hover]": {
          borderColor: "#d7e7fe",
          bgColor: "#d7e7fe",
        },
        "&[data-disabled]": {
          bgColor: "#ECEDEE",
          borderColor: "#ECEDEE",
        },
      },
    },
  },
}
