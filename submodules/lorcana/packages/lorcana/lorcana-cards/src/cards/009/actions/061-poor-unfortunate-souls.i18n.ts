import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const poorUnfortunateSoulsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Poor Unfortunate Souls",
    text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
  },
  de: {
    name: "Arme Seelen in Not",
    text: "Schicke einen Charakter, Gegenstand oder Ort deiner Wahl, der 2 oder weniger kostet, auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Pauvres âmes en perdition",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage, un objet ou un lieu coûtant 2 ou moins et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Mia Triste Anima Sola",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Fai riprendere in mano al suo giocatore un personaggio, un oggetto o un luogo a tua scelta con costo 2 o inferiore.",
      },
    ],
  },
  es: {
    name: "Pobres almas desafortunadas",
    text: "Devuelve el personaje, objeto o ubicación elegido con un coste de 2 o menos a la mano del jugador.",
  },
};
