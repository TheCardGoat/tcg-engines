import type { CharacterCard } from "@tcg/lorcana-types";

export const madDogKarnagesFirstMate: CharacterCard = {
  id: "19p",
  cardType: "character",
  name: "Mad Dog",
  version: "Karnage's First Mate",
  fullName: "Mad Dog - Karnage's First Mate",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "008",
  text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a4b3741414a7ffbb2b4a8666523aba01f6ae53ec",
  },
  abilities: [
    {
      id: "19p-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Don Karnage in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
};
