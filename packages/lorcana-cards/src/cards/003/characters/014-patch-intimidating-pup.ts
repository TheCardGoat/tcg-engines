import type { CharacterCard } from "@tcg/lorcana-types";

export const patchIntimidatingPup: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        modifier: -2,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1p9-1",
      text: "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 4,
  externalIds: {
    ravensburger: "dcd8b13bdaaf51885db54956f3a56d6f87a5f371",
  },
  franchise: "101 Dalmatians",
  fullName: "Patch - Intimidating Pup",
  id: "1p9",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Patch",
  set: "003",
  strength: 3,
  text: "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.",
  version: "Intimidating Pup",
  willpower: 4,
};
