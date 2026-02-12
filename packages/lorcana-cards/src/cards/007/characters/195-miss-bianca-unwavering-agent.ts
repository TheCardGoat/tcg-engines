import type { CharacterCard } from "@tcg/lorcana-types";

export const missBiancaUnwaveringAgent: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have an Ally character in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
        type: "conditional",
      },
      id: "jeo-1",
      text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
      type: "action",
    },
  ],
  cardNumber: 195,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "45f268b2214fbccf3540a2e7412282b75f6885a1",
  },
  franchise: "Rescuers",
  fullName: "Miss Bianca - Unwavering Agent",
  id: "jeo",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Miss Bianca",
  set: "007",
  strength: 5,
  text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
  version: "Unwavering Agent",
  willpower: 5,
};
