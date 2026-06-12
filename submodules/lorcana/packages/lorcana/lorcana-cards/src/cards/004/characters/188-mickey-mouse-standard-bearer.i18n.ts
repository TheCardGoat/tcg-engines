import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseStandardBearerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Standard Bearer",
    text: [
      {
        title: "STAND STRONG",
        description:
          "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Standartenträger",
    text: [
      {
        title: "STARK BLEIBEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2).",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Porte-étendard",
    text: [
      {
        title: "SOIS FORT",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Offensif +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Standard-iere",
    text: [
      {
        title: "RIMANERE SALDO",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Sfidante +2 per questo turno.",
      },
    ],
  },
};
