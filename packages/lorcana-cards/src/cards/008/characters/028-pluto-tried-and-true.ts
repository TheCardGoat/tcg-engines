import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoTriedAndTrue: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            modifier: 2,
            stat: "strength",
            target: "SELF",
            type: "modify-stat",
          },
          {
            keyword: "Support",
            target: "SELF",
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "3hj-1",
      text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support.",
      type: "static",
    },
  ],
  cardNumber: 28,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "0c912a19d4e57cccd16d2d25e6d826cbb6f199b2",
  },
  fullName: "Pluto - Tried and True",
  id: "3hj",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pluto",
  set: "008",
  strength: 2,
  text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Tried and True",
  willpower: 7,
};
