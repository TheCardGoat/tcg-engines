import type { CharacterCard } from "@tcg/lorcana";

export const princePhillipRoyalExplorer: CharacterCard = {
  id: "11j",
  cardType: "character",
  name: "Prince Phillip",
  version: "Royal Explorer",
  fullName: "Prince Phillip - Royal Explorer",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 83,
  inkable: true,
  externalIds: {
    ravensburger: "875592f80cfc4d6e34c02219ce9530abc27695f8",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "11j-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
