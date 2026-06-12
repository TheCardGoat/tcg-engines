import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrSnoopsBetrayedPartnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mr. Snoops",
    version: "Betrayed Partner",
    text: [
      {
        title: "DOUBLE-CROSSING CROOK!",
        description: "During your turn, when this character is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Mr. Snoops",
    version: "Betrogener Partner",
    text: [
      {
        title: "BETRÜGERISCHER GAUNER!",
        description: "Wenn dieser Charakter in deinem Zug verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mr. Snoops",
    version: "Partenaire trahi",
    text: [
      {
        title: "VOUS NE M'ESCROQUEREZ PAS!",
        description:
          "Durant votre tour, lorsque ce personnage est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Signor Snoops",
    version: "Partner Tradito",
    text: [
      {
        title: "BRUTTA LADRONA TRADITRICE",
        description:
          "Durante il tuo turno, quando questo personaggio viene esiliato, puoi pescare una carta.",
      },
    ],
  },
};
