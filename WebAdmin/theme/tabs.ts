export const tabsStyle = {
  variants: {
    button: {
      tablist: {
        bgColor: "var(--c16-color)",
        padding: "3px",
        borderRadius: "5px",
      },
      tab: {
        fontSize: "1.2rem",
        lineHeight: "1.8rem",
        padding: "3px",
        color: "var(--secondary-text-color)",
        fontWeight: "bold",
        borderRadius: "5px",
        _selected: {
          borderColor: "transparent",
          bgColor: "var(--main-color)",
          boxShadow: "none",
          color: "var(--primary-color)",
        },
      },
      tabpanel: {
        padding: 0,
      },
    },
  },
}
