import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouOpportunisticFlunky: CharacterCard = {
  id: "1x0",
  cardType: "character",
  name: "LeFou",
  version: "Opportunistic Flunky",
  fullName: "LeFou - Opportunistic Flunky",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f8c32f163faec632f2671c22514b26af31b45646",
  },
  abilities: [
    {
      id: "1x0-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
