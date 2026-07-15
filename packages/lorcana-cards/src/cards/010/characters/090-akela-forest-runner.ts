import type { CharacterCard } from "@tcg/lorcana-types";

export const akelaForestRunner: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "10m-1",
      text: "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "84044f2f05a69ebe3e2cb39c3ba18b5c1528ed01",
  },
  franchise: "Jungle Book",
  fullName: "Akela - Forest Runner",
  id: "10m",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Akela",
  set: "010",
  strength: 2,
  text: "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.",
  version: "Forest Runner",
  willpower: 5,
};
