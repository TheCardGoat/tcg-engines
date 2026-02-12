import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTheFifthSpirit: CharacterCard = {
  abilities: [
    {
      id: "dwf-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "dwf-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
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
      id: "dwf-3",
      name: "CRYSTALLIZE",
      text: "CRYSTALLIZE When you play this character, exert chosen opposing character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "3219378181dc565b5d4b7488cccbc75d171bb04f",
  },
  franchise: "Frozen",
  fullName: "Elsa - The Fifth Spirit",
  id: "dwf",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Elsa",
  set: "005",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.",
  version: "The Fifth Spirit",
  willpower: 5,
};
