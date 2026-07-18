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
        title: "Schwer bewaffnet",
        description:
          "Jedes Mal, wenn du 1 Karte ziehst, erhält dieser Charakter in diesem Zug <Herausfordern> +1. (Während der Charakter herausfordert, erhält er +1 {S}.)",
      },
    ],
  },
  fr: {
    name: "Garde royal",
    version: "Soldat pieuvre",
    text: [
      {
        title: "Lourdement armé",
        description:
          "Chaque fois que vous piochez une carte, ce personnage gagne <Offensif> +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Guardia Reale",
    version: "Soldato Piovra",
    text: [
      {
        title: "Armato Pesantemente",
        description:
          "Ogni volta che peschi una carta, questo personaggio ottiene <Sfidante> +1 per questo turno. (Riceve +1 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Guardia Real",
    version: "Soldado pulpo",
    text: [
      {
        title: "MUY ARMADO",
        description:
          "Cada vez que robas una carta, este personaje gana Challenger +1 este turno. (Obtienen +1 {S} mientras desafían).",
      },
    ],
  },
};
