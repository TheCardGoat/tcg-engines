import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeSteadfastMate: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "8zn-1",
      text: "GOOD CATCH During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 175,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "2066c7b87a1294f2092f7a77cdef7479b815708d",
  },
  franchise: "Peter Pan",
  fullName: "Mr. Smee - Steadfast Mate",
  id: "8zn",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mr. Smee",
  set: "006",
  strength: 3,
  text: "GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Steadfast Mate",
  willpower: 2,
};
