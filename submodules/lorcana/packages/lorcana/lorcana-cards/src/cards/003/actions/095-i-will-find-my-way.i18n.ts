import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iWillFindMyWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I Will Find My Way",
    text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
  },
  de: {
    name: "Es wird einst gescheh’n",
    text: "Wähle einen deiner Charaktere und gib ihm in diesem Zug +2 {S}. Du darfst ihn kostenlos zu einem Ort bewegen.",
  },
  fr: {
    name: "Je prends le chemin",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 1 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez l'un de vos personnages, il gagne +2 {S} pour le reste de ce tour. Puis vous pouvez le déplacer gratuitement sur un lieu.",
      },
    ],
  },
  it: {
    name: "È Una Meta Che",
    text: [
      {
        title:
          "(Un personaggio con costo 1 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta riceve +2 {S} per questo turno. Può spostarsi in un luogo gratis.",
      },
    ],
  },
  es: {
    name: "Encontraré mi camino",
    text: "El personaje elegido tuyo obtiene +2 {S} este turno. Pueden mudarse a una ubicación de forma gratuita.",
  },
};
