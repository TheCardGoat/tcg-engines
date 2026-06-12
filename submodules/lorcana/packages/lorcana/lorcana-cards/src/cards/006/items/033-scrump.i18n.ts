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
        title: "DIE HAB ICH SELBST",
        description:
          "GENÄHT einen deiner Charaktere — Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2.",
      },
    ],
  },
  fr: {
    name: "Souillon",
    text: [
      {
        title: "C'EST MOI QUI L'AI FAITE",
        description:
          "l'un de vos personnages — Choisissez un personnage qui subit -2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Scrump",
    text: [
      {
        title: "L'HO FATTA IO",
        description:
          "uno dei tuoi personaggi — Un personaggio a tua scelta riceve -2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
