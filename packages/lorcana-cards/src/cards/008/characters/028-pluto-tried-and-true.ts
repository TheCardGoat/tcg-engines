import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoTriedAndTrue: CharacterCard = {
  id: "3hj",
  cardType: "character",
  name: "Pluto",
  version: "Tried and True",
  fullName: "Pluto - Tried and True",
  inkType: ["amber", "steel"],
  set: "008",
  text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  cardNumber: 28,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0c912a19d4e57cccd16d2d25e6d826cbb6f199b2",
  },
  abilities: [
    {
      id: "3hj-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Support",
            target: "SELF",
          },
        ],
      },
      text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
