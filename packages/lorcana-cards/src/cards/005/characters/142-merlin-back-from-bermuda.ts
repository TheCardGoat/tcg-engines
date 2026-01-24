import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinBackFromBermuda: CharacterCard = {
  id: "eka",
  cardType: "character",
  name: "Merlin",
  version: "Back from Bermuda",
  fullName: "Merlin - Back from Bermuda",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "LONG LIVE THE KING! Your characters named Arthur gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "347d00b2ec3b7fe514eaa09b0beb11bffd12ca34",
  },
  abilities: [
    {
      id: "eka-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      text: "LONG LIVE THE KING! Your characters named Arthur gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
