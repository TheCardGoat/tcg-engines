import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodArcheryContestant: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "an opponent has a damaged character in play",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "t9f-1",
      name: "TRICK SHOT",
      text: "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 77,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "69760a52254a4b56186ccc0f1cfde2cf2162aa32",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Archery Contestant",
  id: "t9f",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Robin Hood",
  set: "005",
  strength: 2,
  text: "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
  version: "Archery Contestant",
  willpower: 2,
};
