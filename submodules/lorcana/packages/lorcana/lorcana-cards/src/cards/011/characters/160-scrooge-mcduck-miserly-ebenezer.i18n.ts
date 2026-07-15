import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckMiserlyEbenezerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Miserly Ebenezer",
    text: [
      {
        title: "BAH, HUMBUG",
        description:
          "During your turn, whenever a card is put into your inkwell, chosen character gets -1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Geiziger Ebenezer",
    text: [
      {
        title: "Alles Humbug",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du einem Charakter deiner Wahl in diesem Zug -1 {S} geben.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Ebenezer avare",
    text: [
      {
        title: "Bah, fariboles!",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage qui subit -1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Ebenezer Spilorcio",
    text: [
      {
        title: "Bah, Bubbole",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio a tua scelta riceve -1 {S} per questo turno.",
      },
    ],
  },
};
