// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const OCTheme = {
  dark: false,
  colors: {
    primary: "#FFFFFF",
    secondary: "#FFA500",
    accent: "#e8b200",
    success: "#e8b200",
    error: "#EE5044",
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "OCTheme",
    themes: {
      OCTheme,
    },
  },
});
