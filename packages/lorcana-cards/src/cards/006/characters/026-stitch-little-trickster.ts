import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchLittleTrickster: CharacterCard = {
  id: "kka",
  cardType: "character",
  name: "Stitch",
  version: "Little Trickster",
  fullName: "Stitch - Little Trickster",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4a1ce95842e7ea160a11b6ffde6bb3bdf2594794",
  },
  abilities: [
    {
      id: "kka-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
};
