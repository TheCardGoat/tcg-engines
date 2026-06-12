import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maxLoyalSheepdogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Max",
    version: "Loyal Sheepdog",
    text: [
      {
        title: "HERE BOY",
        description:
          "If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Max",
    version: "Loyaler Hirtenhund",
    text: [
      {
        title: "NA, KOMM HER, JUNGE!",
        description:
          "Wenn du einen Prinz-Eric-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Max",
    version: "Chien de berger fidèle",
    text: [
      {
        title: "VIENS, MON CHIEN",
        description:
          "Si vous avez un personnage Prince Eric en jeu, jouer ce personnage coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Max",
    version: "Fedele Cane Pastore",
    text: [
      {
        title: "QUI BELLO",
        description:
          "Se hai in gioco un personaggio chiamato Principe Eric, paga 1 in meno per giocare questo personaggio.",
      },
    ],
  },
};
