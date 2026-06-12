import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vixeyForestFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vixey",
    version: "Forest Friend",
    text: [
      {
        title: "SHOWIN' UP",
        description:
          "If you have a character named Tod in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "Evasive",
      },
    ],
  },
  de: {
    name: "Trixi, die Füchsin",
    version: "Freundin des Waldes",
    text: [
      {
        title: "KOMMST DU?",
        description:
          "Falls du einen Cap-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Wendig",
      },
    ],
  },
  fr: {
    name: "Vixy",
    version: "Amie de la forêt",
    text: [
      {
        title: "CELLE QUI T'ATTEND",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage Rox en jeu.",
      },
      {
        title: "Insaisissable",
      },
    ],
  },
  it: {
    name: "Vicky",
    version: "Amica del Bosco",
    text: [
      {
        title: "FARTI NOTARE",
        description:
          "Se hai in gioco un personaggio chiamato Red, paga 1 meno per giocare questo personaggio.",
      },
      {
        title: "Sfuggente",
      },
    ],
  },
};
