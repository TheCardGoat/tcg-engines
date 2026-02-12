import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiMagicalBear: CharacterCard = {
  abilities: [
    {
      id: "wwk-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
    {
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
      id: "wwk-2",
      name: "WISDOM OF HIS STORY",
      text: "WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "7696e481f25492ef90ec0b0ac819144fbe6fcffa",
  },
  franchise: "Brother Bear",
  fullName: "Kenai - Magical Bear",
  id: "wwk",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kenai",
  set: "007",
  strength: 1,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nWISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  version: "Magical Bear",
  willpower: 4,
};
