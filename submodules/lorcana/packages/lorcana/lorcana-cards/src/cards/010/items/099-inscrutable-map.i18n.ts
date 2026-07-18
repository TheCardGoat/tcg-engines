import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const inscrutableMapI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Inscrutable Map",
    text: [
      {
        title: "BACKTRACK",
        description:
          "{E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Unergründliche Karte",
    text: [
      {
        title: "Zurückverfolgen",
        description:
          "{E}, 1 {I} — Ein gegnerischer Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges -1 {L}.",
      },
    ],
  },
  fr: {
    name: "Carte indéchiffrable",
    text: [
      {
        title: "Rebrousser chemin",
        description:
          "{E}, 1 {I} — Choisissez un personnage adverse qui subit -1 {L} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Mappa Imperscrutabile",
    text: [
      {
        title: "Tornare sui Propri Passi",
        description:
          "{E}, 1 {I} — Un personaggio avversario a tua scelta riceve -1 {L} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Mapa inescrutable",
    text: [
      {
        title: "VOLVER HACIA ATRÁS",
        description:
          "{E}, 1 {I}: el personaje contrario elegido obtiene -1 {L} hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
