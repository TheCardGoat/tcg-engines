import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseStalwartExplorer: CharacterCard = {
  id: "j8w",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Stalwart Explorer",
  fullName: "Mickey Mouse - Stalwart Explorer",
  inkType: ["steel"],
  set: "003",
  text: "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "455e0ad8701e0c3a71632e7c7d3de965c41fe998",
  },
  abilities: [
    {
      id: "j8w-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
