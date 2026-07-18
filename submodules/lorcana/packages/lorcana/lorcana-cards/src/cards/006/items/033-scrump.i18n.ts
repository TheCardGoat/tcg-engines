import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scrumpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrump",
    text: [
      {
        title: "I MADE HER",
        description:
          "{E} one of your characters — Chosen character gets -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Schrulle",
    text: [
      {
        title: "Die hab ich selbst genäht",
        description:
          "{E} einen deiner Charaktere — Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Souillon",
    text: [
      {
        title: "C'est moi qui l'ai faite",
        description:
          "{E} l'un de vos personnages — Choisissez un personnage qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Scrump",
    text: [
      {
        title: "L'Ho Fatta Io",
        description:
          "{E} uno dei tuoi personaggi — Un personaggio a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Scrum",
    text: [
      {
        title: "YO LA HICE",
        description:
          "{E} uno de tus personajes: el personaje elegido obtiene -2 {S} hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
