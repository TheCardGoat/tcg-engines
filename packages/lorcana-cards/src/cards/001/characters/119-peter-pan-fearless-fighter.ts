import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanFearlessFighter: CharacterCard = {
  abilities: [
    {
      id: "czp-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "2ed2d4d7295557a864451ec395c78721255c0c17",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Fearless Fighter",
  id: "czp",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  name: "Peter Pan",
  set: "001",
  strength: 3,
  text: "Rush (This character can challenge the turn they're played.)",
  version: "Fearless Fighter",
  willpower: 2,
};
