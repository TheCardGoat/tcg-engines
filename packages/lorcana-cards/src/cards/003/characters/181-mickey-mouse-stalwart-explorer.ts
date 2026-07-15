import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseStalwartExplorer: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "j8w-1",
      text: "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.",
      type: "static",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "455e0ad8701e0c3a71632e7c7d3de965c41fe998",
  },
  fullName: "Mickey Mouse - Stalwart Explorer",
  id: "j8w",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "003",
  strength: 3,
  text: "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.",
  version: "Stalwart Explorer",
  willpower: 3,
};
