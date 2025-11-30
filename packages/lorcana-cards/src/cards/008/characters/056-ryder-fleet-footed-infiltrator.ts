import type { CharacterCard } from "@tcg/lorcana";

export const ryderFleetfootedInfiltrator: CharacterCard = {
  id: "14o",
  cardType: "character",
  name: "Ryder",
  version: "Fleet-Footed Infiltrator",
  fullName: "Ryder - Fleet-Footed Infiltrator",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "056",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "92a8bffc338852c3c4d649bd891f34fb5462730e",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "14o-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
