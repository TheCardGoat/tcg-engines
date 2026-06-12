import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tianasPalaceJazzRestaurantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiana's Palace",
    version: "Jazz Restaurant",
    text: [
      {
        title: "NIGHT OUT",
        description: "Characters can't be challenged while here.",
      },
    ],
  },
  de: {
    name: "Tianas Palast",
    version: "Jazz Restaurant",
    text: [
      {
        title: "AUSGEHEN",
        description: "Charaktere an diesem Ort können nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Chez Tiana",
    version: "Restaurant de jazz",
    text: [
      {
        title: "SOIR DE SORTIE",
        description: "Les personnages sur ce lieu ne peuvent pas être défiés.",
      },
    ],
  },
  it: {
    name: "La Reggia di Tiana",
    version: "Ristorante Jazz",
    text: [
      {
        title: "UNA SERATA FUORI I",
        description: "personaggi non possono essere sfidati mentre si trovano in questo luogo.",
      },
    ],
  },
};
