import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTheFifthSpirit: CharacterCard = {
  id: "dwf",
  cardType: "character",
  name: "Elsa",
  version: "The Fifth Spirit",
  fullName: "Elsa - The Fifth Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3219378181dc565b5d4b7488cccbc75d171bb04f",
  },
  abilities: [
    {
      id: "dwf-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "dwf-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "dwf-3",
      type: "triggered",
      name: "CRYSTALLIZE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "CRYSTALLIZE When you play this character, exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};
