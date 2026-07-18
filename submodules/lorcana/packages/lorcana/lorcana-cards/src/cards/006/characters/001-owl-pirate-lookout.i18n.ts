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
        title: "Gut Erkannt",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Maître Hibou",
    version: "Vigie pirate",
    text: [
      {
        title: "Bien vu",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage adverse qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Uffa",
    version: "Vedetta Pirata",
    text: [
      {
        title: "Che Occhio!",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio avversario a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Búho",
    version: "Mirador pirata",
    text: [
      {
        title: "BIEN VISTO",
        description:
          "Durante tu turno, cada vez que se pone una carta en tu tintero, el personaje contrario elegido obtiene -1 {S} hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
