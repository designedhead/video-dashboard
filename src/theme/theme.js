// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const theme = extendTheme({
  initialColorMode: "dark",
  fonts: {
    roboto: roboto.style.fontFamily,
    heading: `${roboto.style.fontFamily}`,
    body: `${roboto.style.fontFamily}`,
  },
  colors: {
    brand: {
      primary: "#F4B8B5",
      secondary: "#FF7AA0",
      dark: "#2F2C23",
    },
  },
  components: {
    MultiSelect: MultiSelectTheme,
    Button: {
      variants: {
        filters: {
          w: "full",
          h: 14,
          justifyContent: "flex-start",
          _hover: { color: "brand.primary" },
          _active: { transform: "scale(0.95)" },
          p: 0,
        },
        download: {
          px: 12,
          py: 6,
          backgroundColor: "brand.primary",
          color: "gray.800",
          borderRadius: "full",
          fontWeight: "bold",
          fontSize: "sm",
          _hover: { transform: "scale(1.02)" },
          _active: { transform: "scale(0.98)" },
        },
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: "pink",
      },
    },
    Badge: {
      variants: {
        new: {
          bgColor: "rgba(251, 182, 206, 0.16)",
          color: "brand.primary",
          borderRadius: "4px",
          fontSize: "md",
        },
      },
    },
  },
});
export default theme;
