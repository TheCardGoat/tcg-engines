import type { CharacterCard } from "@tcg/lorcana";

export const theQueenCruelestOfAll: CharacterCard = {
  id: "s28",
  cardType: "character",
  name: "The Queen",
  version: "Cruelest of All",
  fullName: "The Queen - Cruelest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "6522f49b10eefa0162d9f38ed91efba1027e5efc",
  },
  abilities: [
    {
      id: "s28-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};
