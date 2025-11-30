import type { CharacterCard } from "@tcg/lorcana";

export const rayEasygoingFirefly: CharacterCard = {
  id: "1bk",
  cardType: "character",
  name: "Ray",
  version: "Easygoing Firefly",
  fullName: "Ray - Easygoing Firefly",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "092",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "ab6c67ceb00eb3d0444aff79e47e18bd4a08a536",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1bk-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
