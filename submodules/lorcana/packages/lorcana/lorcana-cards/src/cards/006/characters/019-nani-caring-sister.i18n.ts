import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naniCaringSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani",
    version: "Caring Sister",
    text: [
      {
        title: "Support",
      },
      {
        title: "I AM SO SORRY 2",
        description: "{I} — Chosen character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Nani",
    version: "Fürsorgliche Schwester",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "ES TUT MIR SO LEID 2",
        description: "— Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "Nani",
    version: "Sœur bienveillante",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "JE SUIS",
        description:
          "SINCÈREMENT DÉSOLÉE 2 — Choisissez un personnage qui subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Nani",
    version: "Sorella Premurosa",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "MI DISPIACE MOLTO 2",
        description:
          "— Un personaggio a tua scelta riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
