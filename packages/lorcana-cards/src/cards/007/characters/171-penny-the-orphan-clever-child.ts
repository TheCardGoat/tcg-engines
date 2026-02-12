import type { CharacterCard } from "@tcg/lorcana-types";

export const pennyTheOrphanCleverChild: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "szl-1",
      text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward.",
      type: "action",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "687a88406aa8c1ed46674b0056434598500a6808",
  },
  franchise: "Rescuers",
  fullName: "Penny the Orphan - Clever Child",
  id: "szl",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Penny the Orphan",
  set: "007",
  strength: 2,
  text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  version: "Clever Child",
  willpower: 1,
};
