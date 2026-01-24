import type { CharacterCard } from "@tcg/lorcana-types";

export const cubbyMightyLostBoy: CharacterCard = {
  id: "1y3",
  cardType: "character",
  name: "Cubby",
  version: "Mighty Lost Boy",
  fullName: "Cubby - Mighty Lost Boy",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "003",
  text: "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 69,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fd7f125397c084c57147b01bde680c0f12a8b998",
  },
  abilities: [
    {
      id: "1y3-1",
      type: "triggered",
      name: "THE BEAR",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
