import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const microbotsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Microbots",
    text: [
      {
        title: "LIMITLESS APPLICATIONS",
        description: "You may have any number of cards named Microbots in your deck.",
      },
      {
        title: "INSPIRED TECH",
        description:
          "When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
      },
    ],
  },
  de: {
    name: "Microbots",
    text: [
      {
        title: "UNBEGRENZTE MÖGLICHKEITEN",
        description: "Dein Deck darf beliebig viele Kopien von Microbots enthalten.",
      },
      {
        title: "INSPIRIERTE TECHNIK",
        description:
          "Wenn du diesen Gegenstand ausspielst, gib einem Charakter deiner Wahl in diesem Zug -1 für jeden Microbots-Gegenstand den du im Spiel hast.",
      },
    ],
  },
  fr: {
    name: "microrobots",
    text: [
      {
        title: "DES APPLICATIONS ILLIMITÉES",
        description:
          "Vous pouvez avoir n'importe quel nombre de copies de Microrobots dans votre deck.",
      },
      {
        title: "TECHNOLOGIE INSPIRÉE",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage qui subit -1 pour chaque Objet Microrobots que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Microbot",
    text: [
      {
        title: "APPLICAZIONI ILLIMITATE",
        description: "Puoi avere un qualsiasi numero di carte chiamate Microbot nel tuo mazzo.",
      },
      {
        title: "TECNOLOGIA ISPIRATA",
        description:
          "Quando giochi questo oggetto, un personaggio a tua scelta riceve -1 per questo turno per ogni oggetto chiamato Microbot che hai in gioco.",
      },
    ],
  },
};
