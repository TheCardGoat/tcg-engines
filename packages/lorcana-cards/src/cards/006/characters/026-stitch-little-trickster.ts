import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchLittleTrickster: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "kka-1",
      text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 26,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Alien"],
  cost: 2,
  externalIds: {
    ravensburger: "4a1ce95842e7ea160a11b6ffde6bb3bdf2594794",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Little Trickster",
  id: "kka",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Stitch",
  set: "006",
  strength: 1,
  text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
  version: "Little Trickster",
  willpower: 3,
};
