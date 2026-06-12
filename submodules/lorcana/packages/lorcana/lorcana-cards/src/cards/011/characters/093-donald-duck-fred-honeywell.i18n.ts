import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckFredHoneywellI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Fred Honeywell",
    text: [
      {
        title: "SPIRIT OF GIVING",
        description:
          "Whenever you use the Boost ability of a character, you may put the top card of your deck under them facedown.",
      },
      {
        title: "WELL WISHES",
        description:
          "During opponents' turns, whenever one of your other characters is banished, you may draw a card for each card that was under them.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Fred Honeywell",
    text: [
      {
        title: "GEIST DES GEBENS",
        description:
          "Jedes Mal, wenn du die Stärken-Fähigkeit eines Charakters nutzt, darfst du die oberste Karte deines Decks verdeckt unter jenen legen.",
      },
      {
        title: "GLÜCKWÜNSCHE",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere im Zug einer gegnerischen Person verbannt wird, darfst du für jede Karte, die unter ihm lag, 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Fred Honeywell",
    text: [
      {
        title: "ESPRIT DE GÉNÉROSITÉ",
        description:
          "Chaque fois que vous utilisez la capacité Boost d'un personnage, vous pouvez placer la carte du dessus de votre pioche sous ce personnage-là, face cachée.",
      },
      {
        title: "MEILLEURS VŒUX",
        description:
          "Durant le tour de vos adversaires, chaque fois que l'un de vos autres personnages est banni, vous pouvez piocher une carte pour chaque carte sous ce personnage-là.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Fred Honeywell",
    text: [
      {
        title: "ANIMO GENEROSO",
        description:
          "Ogni volta che usi l'abilità Potenziamento di un personaggio, puoi mettere la prima carta del tuo mazzo a faccia in giù sotto a esso.",
      },
      {
        title: "AUGURI",
        description:
          "Durante i turni degli avversari, ogni volta che uno dei tuoi altri personaggi viene esiliato, puoi pescare una carta per ogni carta che era sotto di esso.",
      },
    ],
  },
};
