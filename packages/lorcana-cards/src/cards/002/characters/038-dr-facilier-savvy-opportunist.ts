import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  externalIds: {
    ravensburger: "7eb3e95e745e4e80a3c3f2b46bce3df355e3acbf",
  },
  abilities: [
    {
      id: "z5l-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
