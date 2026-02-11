import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouOpportunisticFlunky: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      id: "1x0-1",
      text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
      type: "action",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "f8c32f163faec632f2671c22514b26af31b45646",
  },
  franchise: "Beauty and the Beast",
  fullName: "LeFou - Opportunistic Flunky",
  id: "1x0",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "LeFou",
  set: "004",
  strength: 2,
  text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
  version: "Opportunistic Flunky",
  willpower: 3,
};
