import type { CharacterCard } from "@tcg/lorcana-types";

export const pennyTheOrphanCleverChild: CharacterCard = {
  id: "szl",
  cardType: "character",
  name: "Penny the Orphan",
  version: "Clever Child",
  fullName: "Penny the Orphan - Clever Child",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "007",
  text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "687a88406aa8c1ed46674b0056434598500a6808",
  },
  abilities: [
    {
      id: "szl-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
      text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
