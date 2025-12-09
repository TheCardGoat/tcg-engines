import type { CharacterCard } from "@tcg/lorcana";

export const peterPanFearlessFighter: CharacterCard = {
  id: "czp",
  cardType: "character",
  name: "Peter Pan",
  version: "Fearless Fighter",
  fullName: "Peter Pan - Fearless Fighter",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 119,
  inkable: false,
  externalIds: {
    ravensburger: "2ed2d4d7295557a864451ec395c78721255c0c17",
  },
  abilities: [
    {
      id: "czp-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
