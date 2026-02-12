import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounHardnosedLeader: CharacterCard = {
  abilities: [
    {
      id: "eco-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "eco-2",
      name: "LOOT DROP",
      text: "LOOT DROP When this character is banished, gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 32,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "33b9c6a65331f2a7dd61ada4198a004de3dca94a",
  },
  franchise: "Wreck It Ralph",
  fullName: "Calhoun - Hard-Nosed Leader",
  id: "eco",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Calhoun",
  set: "008",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLOOT DROP When this character is banished, gain 1 lore.",
  version: "Hard-Nosed Leader",
  willpower: 5,
};
