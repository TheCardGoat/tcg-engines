import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grammaTalaConnectedToNatureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gramma Tala",
    version: "Connected to Nature",
    text: [
      {
        title: "ANCESTORS' GIFT",
        description: "For each card in your inkwell, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Gramma Tala",
    version: "Naturverbunden",
    text: [
      {
        title: "DAS GESCHENK DER AHNEN",
        description:
          "Für jede Karte in deinem Tintenvorrat zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Grand-mère Tala",
    version: "En communion avec la nature",
    text: [
      {
        title: "DON DES ANCIENS",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque carte dans votre réserve d'encre.",
      },
    ],
  },
  it: {
    name: "Nonna Tala",
    version: "Connessa con la Natura",
    text: [
      {
        title: "DONO DEGLI ANTENATI",
        description:
          "Per ogni carta nel tuo calamaio, paga 1 in meno per giocare questo personaggio.",
      },
    ],
  },
};
