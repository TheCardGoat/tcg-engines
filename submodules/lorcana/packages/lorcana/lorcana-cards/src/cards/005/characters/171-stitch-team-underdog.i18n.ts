import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchTeamUnderdogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Team Underdog",
    text: [
      {
        title: "HEAVE HO!",
        description: "When you play this character, you may deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Team Außenseiter",
    text: [
      {
        title: "HAU RUCK!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Outsider de l'équipe",
    text: [
      {
        title: "HO HISSE!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Sfavorito della Squadra",
    text: [
      {
        title: "OH ISSA!",
        description:
          "Quando giochi questo personaggio, puoi infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
