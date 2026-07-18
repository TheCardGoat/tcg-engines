import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const longboatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Longboat",
    text: [
      {
        title: "TAKE IT FOR A SPIN 2",
        description:
          "{I} — Chosen character of yours gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Langboot",
    text: [
      {
        title: "Eine Spritztour machen",
        description:
          "2 {I} — Wähle einen deiner Charaktere. Dieser erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Chaloupe",
    text: [
      {
        title: "Faire un tour",
        description:
          "2 {I} — Choisissez l'un de vos personnages qui gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Scialuppa",
    text: [
      {
        title: "Uscire per Un Giretto",
        description:
          "2 {I} — Un tuo personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Lancha",
    text: [
      {
        title: "Llévalo a dar una vuelta 2",
        description:
          "{I}: tu personaje elegido gana Evasivo hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
