import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rubyCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ruby Coil",
    text: [
      {
        title: "CRIMSON SPARK",
        description:
          "During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Rubin-Reif",
    text: [
      {
        title: "KARMINROTER FUNKE",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, gib einem Charakter deiner Wahl in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Spirale de Rubis",
    text: [
      {
        title: "ÉTINCELLE POURPRE",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Spira di Rubino",
    text: [
      {
        title: "SCINTILLA SCARLATTA",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio a tua scelta riceve +2 per questo turno.",
      },
    ],
  },
};
