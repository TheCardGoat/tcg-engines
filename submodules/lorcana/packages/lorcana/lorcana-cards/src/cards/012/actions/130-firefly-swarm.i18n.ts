import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fireflySwarmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Firefly Swarm",
    text: [
      {
        title: "Choose one:",
      },
      {
        title: "• Banish chosen character with 2 {S} or less.",
      },
      {
        title:
          "• If 2 or more other cards were put into your discard this turn, banish chosen character.",
      },
    ],
  },
  de: {
    name: "Feuerfliegen-Schwarm",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Verbanne einen Charakter deiner Wahl mit 2 oder weniger {S}.",
      },
      {
        title:
          "• Falls in diesem Zug mindestens 2 weitere Karten auf deinen Ablagestapel gelegt wurden, verbanne einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Essaim de lucioles",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Choisissez un personnage ayant 2 {S} ou moins et bannissez-le.",
      },
      {
        title:
          "• Si 2 autres cartes ou plus ont été placées dans votre défausse ce tour-ci, choisissez un personnage et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Sciame di Lucciole",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Esilia un personaggio a tua scelta con 2 {S} o inferiore.",
      },
      {
        title:
          "• Se 2 o più altre carte sono state messe nei tuoi scarti in questo turno, esilia un personaggio a tua scelta.",
      },
    ],
  },
};
