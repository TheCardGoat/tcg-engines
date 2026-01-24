import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiMagicalBear: CharacterCard = {
  id: "wwk",
  cardType: "character",
  name: "Kenai",
  version: "Magical Bear",
  fullName: "Kenai - Magical Bear",
  inkType: ["amethyst"],
  franchise: "Brother Bear",
  set: "007",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nWISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 70,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7696e481f25492ef90ec0b0ac819144fbe6fcffa",
  },
  abilities: [
    {
      id: "wwk-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
    {
      id: "wwk-2",
      type: "triggered",
      name: "WISDOM OF HIS STORY",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: "SELF",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
