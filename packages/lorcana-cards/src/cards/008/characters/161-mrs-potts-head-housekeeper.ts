import type { CharacterCard } from "@tcg/lorcana";

export const mrsPottsHeadHousekeeper: CharacterCard = {
  id: "cpn",
  cardType: "character",
  name: "Mrs. Potts",
  version: "Head Housekeeper",
  fullName: "Mrs. Potts - Head Housekeeper",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "CLEAN UP , Banish one of your items — Draw a card.",
  cardNumber: "161",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "2dd0dfa5cece069d35c5263852b8fca5400530e7",
  },
  abilities: [
    {
      id: "cpn-1",
      name: "CLEAN UP",
      text: "CLEAN UP , Banish one of your items — Draw a card.",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
