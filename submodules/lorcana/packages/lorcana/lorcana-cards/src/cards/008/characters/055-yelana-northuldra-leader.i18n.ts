import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yelanaNorthuldraLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yelana",
    version: "Northuldra Leader",
    text: [
      {
        title: "WE ONLY TRUST NATURE",
        description:
          "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Yelena",
    version: "Anführerin der Northuldra",
    text: [
      {
        title: "WIR VERTRAUEN NUR AUF DIE NATUR",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2).",
      },
    ],
  },
  fr: {
    name: "Yelena",
    version: "Cheffe des Northuldra",
    text: [
      {
        title: "NOUS N'AVONS CONFIANCE QU'EN LA NATURE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Offensif +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Yelena",
    version: "Capo dei Northuldri",
    text: [
      {
        title: "CI FIDIAMO SOLO DELLA NATURA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Sfidante +2 per questo turno.",
      },
    ],
  },
};
