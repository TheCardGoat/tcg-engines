import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsPottsHeadHousekeeper: CharacterCard = {
  id: "cpn",
  cardType: "character",
  name: "Mrs. Potts",
  version: "Head Housekeeper",
  fullName: "Mrs. Potts - Head Housekeeper",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "CLEAN UP {E}, Banish one of your items — Draw a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 161,
  inkable: true,
  externalIds: {
    ravensburger: "2dd0dfa5cece069d35c5263852b8fca5400530e7",
  },
  abilities: [
    {
      id: "cpn-1",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "CLEAN UP {E}, Banish one of your items — Draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
