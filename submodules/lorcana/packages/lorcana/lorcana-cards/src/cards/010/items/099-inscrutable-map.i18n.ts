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
        title: "ZURÜCKVERFOLGEN,",
        description:
          "1 — Ein gegnerischer Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "Carte indéchiffrable",
    text: [
      {
        title: "REBROUSSER CHEMIN, 1",
        description:
          "— Choisissez un personnage adverse qui subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Mappa Imperscrutabile",
    text: [
      {
        title: "TORNARE SUI PROPRI PASSI, 1",
        description:
          "— Un personaggio avversario a tua scelta riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
