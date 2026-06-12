import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amberCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amber Coil",
    text: [
      {
        title: "HEALING AURA",
        description:
          "During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Bernstein-Reif",
    text: [
      {
        title: "HEILENDE AURA",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du bis zu 2 Schaden von einem Charakter deiner Wahl entfernen.",
      },
    ],
  },
  fr: {
    name: "Spirale d’ambre",
    text: [
      {
        title: "AURA GUÉRISSEUSE",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez choisir un personnage et lui retirer jusqu'à 2 dommages.",
      },
    ],
  },
  it: {
    name: "Spira d'Ambra",
    text: [
      {
        title: "AURA CURATIVA",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi rimuovere fino a 2 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
