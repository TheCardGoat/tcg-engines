import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratiganPartyCrasherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan",
    version: "Party Crasher",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Evasive",
      },
      {
        title: "DELIGHTFULLY WICKED",
        description: "Your damaged characters get +2 {S}.",
      },
    ],
  },
  de: {
    name: "Rattenzahn",
    version: "Partycrasher",
    text: [
      {
        title: "Gestaltwandel 4",
      },
      {
        title: "Wendig",
      },
      {
        title: "FANTASTISCH NIEDERTRÄCHTIG",
        description: "Deine beschädigten Charaktere erhalten +2.",
      },
    ],
  },
  fr: {
    name: "Ratigan",
    version: "Trouble-fête",
    text: [
      {
        title: "Alter 4",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "DÉLICIEUSEMENT VILAIN",
        description: "Vos personnages ayant au moins un dommage sur eux gagnent +2.",
      },
    ],
  },
  it: {
    name: "Rattigan",
    version: "Guastafeste",
    text: [
      {
        title: "Trasformazione 4",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "DELIZIOSAMENTE CRUDELE",
        description: "I tuoi personaggi danneggiati ricevono +2.",
      },
    ],
  },
};
