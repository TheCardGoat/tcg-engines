import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sapphireCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sapphire Coil",
    text: [
      {
        title: "BRILLIANT SHINE",
        description:
          "During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Saphir-Reif",
    text: [
      {
        title: "STRAHLENDER GLANZ",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du einem Charakter deiner Wahl in diesem Zug -2 geben.",
      },
    ],
  },
  fr: {
    name: "Spirale de Saphir",
    text: [
      {
        title: "ÉCLAT LUSTRÉ",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez choisir un personnage qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Spira di Zaffiro",
    text: [
      {
        title: "SPLENDORE LUCENTE",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi dare -2 a un personaggio a tua scelta per questo turno.",
      },
    ],
  },
};
