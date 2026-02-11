import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinBackFromBermuda: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      id: "eka-1",
      text: "LONG LIVE THE KING! Your characters named Arthur gain Resist +1.",
      type: "action",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "347d00b2ec3b7fe514eaa09b0beb11bffd12ca34",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Back from Bermuda",
  id: "eka",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Merlin",
  set: "005",
  strength: 1,
  text: "LONG LIVE THE KING! Your characters named Arthur gain Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Back from Bermuda",
  willpower: 4,
};
