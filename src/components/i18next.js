import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./lng/en.json";
import kan from "./lng/kan.json";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    kan: {
      translation: kan,
    },
  },
  lng: localStorage.getItem("lng") || "en",
});

export default i18next;
