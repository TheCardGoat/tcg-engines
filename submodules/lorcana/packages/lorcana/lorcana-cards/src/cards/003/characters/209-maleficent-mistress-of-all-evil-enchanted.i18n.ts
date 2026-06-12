import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maleficentMistressOfAllEvilEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maleficent",
    version: "Mistress of All Evil",
    text: [
      {
        title: "DARK KNOWLEDGE",
        description: "Whenever this character quests, you may draw a card.",
      },
      {
        title: "DIVINATION",
        description:
          "During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Malefiz",
    version: "Herrin des Bösen",
    text: [
      {
        title: "FINSTERES WISSEN",
        description: "Jedes Mal, wenn dieser Charakter erkundet, darfst du 1 Karte ziehen.",
      },
      {
        title: "WAHRSAGUNG",
        description:
          "Jedes Mal, wenn du in deinem Zug 1 Karte ziehst, darfst du 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Maléfique",
    version: "Maîtresse du Mal",
    text: [
      {
        title: "SAVOIR OBSCUR",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez piocher une carte.",
      },
      {
        title: "DIVINATION",
        description:
          "Chaque fois que vous piochez une carte durant votre tour, vous pouvez choisir un personnage et déplacer 1 de ses jetons Dommage sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Malefica",
    version: "Signora di Ogni Male",
    text: [
      {
        title: "SAPERE OSCURO",
        description: "Ogni volta che questo personaggio va all'avventura, puoi pescare una carta.",
      },
      {
        title: "DIVINAZIONE",
        description:
          "Durante il tuo turno, ogni volta che peschi una carta, puoi spostare 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
