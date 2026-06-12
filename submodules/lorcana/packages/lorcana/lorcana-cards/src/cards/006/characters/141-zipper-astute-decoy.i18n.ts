import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zipperAstuteDecoyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zipper",
    version: "Astute Decoy",
    text: [
      {
        title: "Ward",
      },
      {
        title: "RUN INTERFERENCE",
        description:
          "During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Summi",
    version: "Scharfsinniger Lockvogel",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "EINGREIFEN",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält ein anderer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges Robust +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Ruzor",
    version: "Leurre astucieux",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "EN INTERPOSITION",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un autre personnage qui gagne Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Zipper",
    version: "Astuto Diversivo",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "INTERFERIRE",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un altro personaggio a tua scelta ottiene Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
