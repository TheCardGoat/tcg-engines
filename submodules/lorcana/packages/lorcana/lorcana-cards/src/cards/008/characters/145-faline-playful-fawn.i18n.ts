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
        title: "<Wendig>",
      },
      {
        title: "Vorwitzige Freundin",
        description:
          "Solange du einen Charakter mit einer höheren {S} als die {S} jedes gegnerischen Charakters im Spiel hast, erhält dieser Charakter +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Féline",
    version: "Faonne enjouée",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Amie de jeunesse",
        description:
          "Tant que vous avez un personnage en jeu avec plus de {S} que n'importe quel autre personnage adverse, ce personnage-ci gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Faline",
    version: "Cerbiatta Giocosa",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Amica Alla Mano",
        description:
          "Mentre hai in gioco un personaggio con più {S} di ogni personaggio avversario, questo personaggio riceve +2 {L}.",
      },
    ],
  },
};
