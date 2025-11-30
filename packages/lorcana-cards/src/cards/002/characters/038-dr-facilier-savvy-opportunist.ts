import type { CharacterCard } from "@tcg/lorcana";

export const drFacilierSavvyOpportunist: CharacterCard = {
  id: "z5l",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Savvy Opportunist",
  fullName: "Dr. Facilier - Savvy Opportunist",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "038",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "7eb3e95e745e4e80a3c3f2b46bce3df355e3acbf",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "z5la1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
