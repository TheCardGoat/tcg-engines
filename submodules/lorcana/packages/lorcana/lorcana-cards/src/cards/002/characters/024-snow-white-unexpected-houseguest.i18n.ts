import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowWhiteUnexpectedHouseguestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow White",
    version: "Unexpected Houseguest",
    text: [
      {
        title: "HOW DO YOU DO?",
        description: "You pay 1 {I} less to play Seven Dwarfs characters.",
      },
    ],
  },
  de: {
    name: "Schneewittchen",
    version: "Unerwarteter Gast",
    text: [
      {
        title: "Einen schönen guten Morgen",
        description: "Du zahlst 1 {I} weniger, um die Sieben Zwerge auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Blanche-Neige",
    version: "Invitée inattendue",
    text: [
      {
        title: "Enchantée, Messieurs",
        description: "Les personnages Sept Nains vous coûtent 1 {I} de moins à jouer.",
      },
    ],
  },
  it: {
    name: "Snow White",
    version: "Unexpected Houseguest",
    text: "How Do You Do?\\ You pay 1 {I} less to play Seven Dwarfs characters.",
  },
};
