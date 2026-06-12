import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sneezyNoisyKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sneezy",
    version: "Noisy Knight",
    text: [
      {
        title: "HEADWIND",
        description:
          "When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Hatschi",
    version: "Ritter der Geräusche",
    text: [
      {
        title: "GEGENWIND",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Ritter deiner Wahl in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2.)",
      },
    ],
  },
  fr: {
    name: "Atchoum",
    version: "Chevalier bruyant",
    text: [
      {
        title: "VENT CONTRAIRE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Chevalier qui gagne Offensif +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Eolo",
    version: "Cavaliere Rumoroso",
    text: [
      {
        title: "VENTO CONTRARIO",
        description:
          "Quando giochi questo personaggio, un personaggio Cavaliere a tua scelta ottiene Sfidante +2 per questo turno.",
      },
    ],
  },
};
