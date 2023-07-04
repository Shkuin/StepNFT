import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#D0F778",
    },
    secondary: {
      main: "#828498",
    },
    background: {
      default: "#13141f",
    },
    info: {
      main: "#ffffff",
    },
    text: {
      disabled: "#1D1F36",
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        markLabel: {
          fontFamily: "montserrat",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: 14,
          color: "white",
        },
        mark: {
          color: "transparent",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          padding: "4px",
          minWidth: "41px",
          textTransform: "none",
          fontWeight: 900,
          fontFamily: "montserrat",
        },
        outlined: {
          color: "white",
          borderColor: "GrayText"
        },
      },
    },
  },
});
