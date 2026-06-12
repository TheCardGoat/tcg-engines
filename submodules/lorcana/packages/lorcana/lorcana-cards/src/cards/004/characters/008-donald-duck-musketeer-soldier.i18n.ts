import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckMusketeerSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Musketeer Soldier",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "WAIT FOR ME!",
        description: "When you play this character, chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Musketier-Soldat",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "WARTET AUF MICH",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Mousquetaire soldat",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "ATTENDEZ-MOI!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Soldato Moschettiere",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "ECCOMI, ARRIVO!",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +1 per questo turno.",
      },
    ],
  },
};
