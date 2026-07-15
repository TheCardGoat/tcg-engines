import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiIntellectualSchemer: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "8zk-1",
      text: "INNOVATE You pay 1 {I} less to play characters using their Shift ability.",
      type: "action",
    },
  ],
  cardNumber: 97,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Inventor"],
  cost: 2,
  externalIds: {
    ravensburger: "2065122bd47f279ddd80c1814074e29a04edb565",
  },
  franchise: "Big Hero 6",
  fullName: "Yokai - Intellectual Schemer",
  id: "8zk",
  inkType: ["emerald", "sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Yokai",
  set: "007",
  strength: 1,
  text: "INNOVATE You pay 1 {I} less to play characters using their Shift ability.",
  version: "Intellectual Schemer",
  willpower: 2,
};
