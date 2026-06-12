import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const owlPirateLookoutI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Owl",
    version: "Pirate Lookout",
    text: [
      {
        title: "WELL SPOTTED",
        description:
          "During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Eule",
    version: "Piraten-Ausguck",
    text: [
      {
        title: "GUT ERKANNT",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "Maître Hibou",
    version: "Vigie pirate",
    text: [
      {
        title: "BIEN VU",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage adverse qui subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Uffa",
    version: "Vedetta Pirata",
    text: [
      {
        title: "CHE OCCHIO!",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio avversario a tua scelta riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
