import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sarabiProtectingThePrideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sarabi",
    version: "Protecting the Pride",
    text: [
      {
        title: "FEARSOME SNARL",
        description:
          "{E} — Chosen opposing character gets -4 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Sarabi",
    version: "Schützt das Rudel",
    text: [
      {
        title: "FURCHTERREGENDES KNURREN",
        description:
          "— Ein gegnerischer Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges -4.",
      },
    ],
  },
  fr: {
    name: "Sarabi",
    version: "Protégeant la troupe",
    text: [
      {
        title: "GROGNEMENT EFFRAYANT",
        description:
          "— Choisissez un personnage adverse qui subit -4 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Sarabi",
    version: "Protettrice del Branco",
    text: [
      {
        title: "RINGHIO SPAVENTOSO",
        description:
          "— Un personaggio avversario a tua scelta riceve -4 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
