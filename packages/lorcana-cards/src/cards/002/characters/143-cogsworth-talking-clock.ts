import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthTalkingClock: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "y7r-1",
      text: "WAIT A MINUTE Your characters with Reckless gain “{E} — Gain 1 lore.”",
      type: "activated",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "7b50975b1d3f12da9b7fe8822eb27ad690318c58",
  },
  franchise: "Beauty and the Beast",
  fullName: "Cogsworth - Talking Clock",
  id: "y7r",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cogsworth",
  set: "002",
  strength: 2,
  text: "WAIT A MINUTE Your characters with Reckless gain “{E} — Gain 1 lore.”",
  version: "Talking Clock",
  willpower: 3,
};
