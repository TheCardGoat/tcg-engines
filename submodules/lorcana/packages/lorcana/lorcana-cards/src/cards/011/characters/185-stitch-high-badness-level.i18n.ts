import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchHighBadnessLevelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "High Badness Level",
    text: [
      {
        title: "AMPED UP",
        description:
          "While you have a character named Lilo in play, this character gains Challenger +3. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Hoher Bös-o-meter Stand",
    text: [
      {
        title: "VERSTÄRKT",
        description:
          "Solange du mindestens einen Lilo-Charakter im Spiel hast, erhält dieser Charakter Herausfordern +3. (Während der Charakter herausfordert, erhält er +3.)",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Au niveau de méchanceté élevé",
    text: [
      {
        title: "SURVOLTÉ",
        description:
          "Tant que vous avez un personnage Lilo en jeu, ce personnage-ci gagne Offensif +3.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Alto Livello di Cattiveria",
    text: [
      {
        title: "SU DI GIRI",
        description:
          "Mentre hai in gioco un personaggio chiamato Lilo, questo personaggio ottiene Sfidante +3.",
      },
    ],
  },
};
