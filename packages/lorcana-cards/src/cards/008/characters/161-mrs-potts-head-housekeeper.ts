import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsPottsHeadHousekeeper: CharacterCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "cpn-1",
      text: "CLEAN UP {E}, Banish one of your items — Draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 161,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "2dd0dfa5cece069d35c5263852b8fca5400530e7",
  },
  franchise: "Beauty and the Beast",
  fullName: "Mrs. Potts - Head Housekeeper",
  id: "cpn",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Mrs. Potts",
  set: "008",
  strength: 2,
  text: "CLEAN UP {E}, Banish one of your items — Draw a card.",
  version: "Head Housekeeper",
  willpower: 4,
};
