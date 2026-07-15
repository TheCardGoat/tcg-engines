import type { CharacterCard } from "@tcg/lorcana-types";

export const cubbyMightyLostBoy: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1y3-1",
      name: "THE BEAR",
      text: "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "fd7f125397c084c57147b01bde680c0f12a8b998",
  },
  franchise: "Peter Pan",
  fullName: "Cubby - Mighty Lost Boy",
  id: "1y3",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cubby",
  set: "003",
  strength: 3,
  text: "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.",
  version: "Mighty Lost Boy",
  willpower: 5,
};
