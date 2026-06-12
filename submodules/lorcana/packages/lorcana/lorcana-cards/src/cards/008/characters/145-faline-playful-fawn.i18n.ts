import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const falinePlayfulFawnI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Faline",
    version: "Playful Fawn",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PRECOCIOUS FRIEND",
        description:
          "While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Feline",
    version: "Verspieltes Rehkitz",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "VORWITZIGE FREUNDIN",
        description:
          "Solange du einen Charakter mit einer höheren als die jedes gegnerischen Charakters im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Féline",
    version: "Faonne enjouée",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "AMIE DE JEUNESSE",
        description:
          "Tant que vous avez un personnage en jeu avec plus de que n'importe quel autre personnage adverse, ce personnage-ci gagne +2.",
      },
    ],
  },
  it: {
    name: "Faline",
    version: "Cerbiatta Giocosa",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "AMICA ALLA MANO",
        description:
          "Mentre hai in gioco un personaggio con più di ogni personaggio avversario, questo personaggio riceve +2.",
      },
    ],
  },
};
