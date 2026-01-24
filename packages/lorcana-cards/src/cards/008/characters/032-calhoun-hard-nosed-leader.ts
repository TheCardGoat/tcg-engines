import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounHardnosedLeader: CharacterCard = {
  id: "eco",
  cardType: "character",
  name: "Calhoun",
  version: "Hard-Nosed Leader",
  fullName: "Calhoun - Hard-Nosed Leader",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLOOT DROP When this character is banished, gain 1 lore.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 32,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "33b9c6a65331f2a7dd61ada4198a004de3dca94a",
  },
  abilities: [
    {
      id: "eco-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "eco-2",
      type: "triggered",
      name: "LOOT DROP",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "LOOT DROP When this character is banished, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
