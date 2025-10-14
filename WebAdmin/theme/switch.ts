export const switchStyle = {
  baseStyle: {
    track: {
      display: "flex",
      alignItems: "center",
      _focus: {
        boxShadow: "none",
      },
      backgroundColor: "var(--secondary-bg-color)",
      _checked: {
        backgroundColor: "var(--main-color)",
      },
      p: "0.5rem",
    },
    thumb: {
      width: "1.5rem",
      heigth: "1.5rem",
    },
  },
}
