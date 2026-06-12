import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yzmaConnivingChemistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yzma",
    version: "Conniving Chemist",
    text: [
      {
        title: "FEEL THE POWER",
        description:
          "{E} — If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
      },
    ],
  },
  de: {
    name: "Isma",
    version: "Hinterhältige Chemikerin",
    text: [
      {
        title: "FÜHL DIE MACHT",
        description:
          "— Wenn du weniger als 3 Karten auf deiner Hand hast, ziehe so viele Karten, bis du 3 Karten auf deiner Hand hast.",
      },
    ],
  },
  fr: {
    name: "Yzma",
    version: "Chimiste sournoise",
    text: [
      {
        title: "SENS LA PUISSANCE",
        description:
          "— Si vous avez moins de 3 cartes en main, piochez jusqu'à avoir 3 cartes en main.",
      },
    ],
  },
  it: {
    name: "Yzma",
    version: "Subdola Chimica",
    text: [
      {
        title: "AVVERTI IL NERO POTERE",
        description: "— Se hai meno di 3 carte in mano, pesca finché non hai 3 carte in mano.",
      },
    ],
  },
};
