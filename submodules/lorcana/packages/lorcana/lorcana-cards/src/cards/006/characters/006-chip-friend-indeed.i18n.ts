import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipFriendIndeedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip",
    version: "Friend Indeed",
    text: [
      {
        title: "DALE'S PARTNER",
        description: "When you play this character, chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Chip",
    version: "Freund in der Tat",
    text: [
      {
        title: "CHAPS PARTNER",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Ami dont on a besoin",
    text: [
      {
        title: "PARTENAIRE DE TAC",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Amico al Bisogno",
    text: [
      {
        title: "PARTNER DI CIOP",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +1 per questo turno.",
      },
    ],
  },
};
