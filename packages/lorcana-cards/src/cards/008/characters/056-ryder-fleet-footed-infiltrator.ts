import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  externalIds: {
    ravensburger: "92a8bffc338852c3c4d649bd891f34fb5462730e",
  },
  abilities: [
    {
      id: "14o-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
