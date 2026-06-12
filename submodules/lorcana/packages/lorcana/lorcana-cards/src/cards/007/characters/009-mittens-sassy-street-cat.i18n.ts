import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mittensSassyStreetCatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mittens",
    version: "Sassy Street Cat",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "NO THANKS NECESSARY",
        description:
          "Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Mittens",
    version: "Freche Straßenkatze",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "NICHTS ZU DANKEN",
        description:
          "Einmal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhalten deine anderen Charaktere mit Beschützen in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Mitaine",
    version: "Chatte de gouttière insolente",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "NE ME REMERCIE PAS",
        description:
          "Une seule fois durant votre tour, lorsqu'une carte est placée dans votre réserve d'encre, vos autres personnages avec Rempart gagnent +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mittens",
    version: "Insolente Gatta di Strada",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "NON SERVE RINGRAZIARE",
        description:
          "Una volta durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, i tuoi altri personaggi con Guardiano ricevono +1 per questo turno.",
      },
    ],
  },
};
