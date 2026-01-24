import type { CharacterCard } from "@tcg/lorcana-types";

export const missBiancaUnwaveringAgent: CharacterCard = {
  id: "jeo",
  cardType: "character",
  name: "Miss Bianca",
  version: "Unwavering Agent",
  fullName: "Miss Bianca - Unwavering Agent",
  inkType: ["steel"],
  franchise: "Rescuers",
  set: "007",
  text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 195,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "45f268b2214fbccf3540a2e7412282b75f6885a1",
  },
  abilities: [
    {
      id: "jeo-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have an Ally character in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
