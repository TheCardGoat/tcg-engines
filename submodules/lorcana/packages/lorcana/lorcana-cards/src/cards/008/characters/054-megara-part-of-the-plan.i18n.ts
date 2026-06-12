import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const megaraPartOfThePlanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Megara",
    version: "Part of the Plan",
    text: [
      {
        title: "CONTENTIOUS ALLIANCE",
        description:
          "While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Meg",
    version: "Teil des Plans",
    text: [
      {
        title: "UMSTRITTENE ALLIANZ",
        description:
          "Solange du mindestens einen Hades-Charakter im Spiel hast, erhält dieser Charakter Herausfordern +2. (Während der Charakter herausfordert, erhält er +2.)",
      },
    ],
  },
  fr: {
    name: "Mégara",
    version: "Fait partie du plan",
    text: [
      {
        title: "ALLIANCE FRAGILE",
        description:
          "Tant que vous avez un personnage nommé Hadès en jeu, ce personnage-ci gagne Offensif +2.",
      },
    ],
  },
  it: {
    name: "Megara",
    version: "Parte del Piano",
    text: [
      {
        title: "ALLEANZA CONTROVERSA",
        description:
          "Mentre hai in gioco un personaggio chiamato Ade, questo personaggio ottiene Sfidante +2.",
      },
    ],
  },
};
