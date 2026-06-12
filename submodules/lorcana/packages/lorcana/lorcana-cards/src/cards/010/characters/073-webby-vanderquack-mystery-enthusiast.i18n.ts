import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const webbyVanderquackMysteryEnthusiastI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Webby Vanderquack",
    version: "Mystery Enthusiast",
    text: [
      {
        title: "CONTAGIOUS ENERGY",
        description: "When you play this character, chosen character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Nicky Vanderquack",
    version: "Liebhaberin von Mysterien",
    text: [
      {
        title: "ANSTECKENDE ENERGIE",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Zaza",
    version: "Amatrice de mystères",
    text: [
      {
        title: "ÉNERGIE COMMUNICATIVE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Gaia Vanderquack",
    version: "Patita dei Misteri",
    text: [
      {
        title: "ENERGIA CONTAGIOSA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +1 per questo turno.",
      },
    ],
  },
};
