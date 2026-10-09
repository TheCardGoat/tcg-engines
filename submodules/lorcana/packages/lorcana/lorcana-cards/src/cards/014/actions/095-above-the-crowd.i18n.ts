import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aboveTheCrowdI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Above the Crowd",
    text: "Put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
  },
  de: {
    name: "Above the Crowd",
    text: "Lege einen gegnerischen Charakter deiner Wahl mit 3 oder weniger {S} unter das zugehörige Deck.",
  },
  fr: {
    name: "Above the Crowd",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage adverse ayant 3 {S} ou moins et placez-le sous la pioche de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Above the Crowd",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Metti un personaggio avversario a tua scelta con 3 {S} o inferiore in fondo al mazzo del suo giocatore.",
      },
    ],
  },
  es: {
    name: "Above the Crowd",
    text: "Put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
  },
};
