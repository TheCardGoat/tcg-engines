import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marieFavoredKittenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Marie",
    version: "Favored Kitten",
    text: [
      {
        title: "I'LL SHOW YOU",
        description:
          "Whenever this character quests, you may give chosen character -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Marie",
    version: "Bevorzugtes Kätzchen",
    text: [
      {
        title: "ICH WERD'S DIR ZEIGEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem Charakter deiner Wahl in diesem Zug -2 geben.",
      },
    ],
  },
  fr: {
    name: "Marie",
    version: "Chatonne privilégiée",
    text: [
      {
        title: "JE VAIS TE FAIRE VOIR",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Minou",
    version: "Gattina Prediletta",
    text: [
      {
        title: "TI FACCIO VEDERE IO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi dare -2 a un personaggio a tua scelta per questo turno.",
      },
    ],
  },
};
