import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarAspiringRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Aspiring Ruler",
    text: [
      {
        title: "THAT'S BETTER",
        description:
          "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Aufstrebender Herrscher",
    text: [
      {
        title: "SO IST ES BESSER",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2).",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Aspirant souverain",
    text: [
      {
        title: "VOILÀ QUI EST MIEUX",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Offensif +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Aspirante Monarca",
    text: [
      {
        title: "COSÌ VA MEGLIO",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Sfidante +2 per questo turno.",
      },
    ],
  },
};
