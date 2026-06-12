import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const royalGuardOctopusSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Royal Guard",
    version: "Octopus Soldier",
    text: [
      {
        title: "HEAVILY ARMED",
        description:
          "Whenever you draw a card, this character gains Challenger +1 this turn. (They get +1 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Königsgarde",
    version: "Oktopus-Soldat",
    text: [
      {
        title: "SCHWER BEWAFFNET",
        description:
          "Jedes Mal, wenn du 1 Karte ziehst, erhält dieser Charakter in diesem Zug Herausfordern +1. (Während der Charakter herausfordert, erhält er +1.)",
      },
    ],
  },
  fr: {
    name: "Garde royal",
    version: "Soldat pieuvre",
    text: [
      {
        title: "LOURDEMENT ARMÉ",
        description:
          "Chaque fois que vous piochez une carte, ce personnage gagne Offensif +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Guardia Reale",
    version: "Soldato Piovra",
    text: [
      {
        title: "ARMATO PESANTEMENTE",
        description:
          "Ogni volta che peschi una carta, questo personaggio ottiene Sfidante +1 per questo turno.",
      },
    ],
  },
};
