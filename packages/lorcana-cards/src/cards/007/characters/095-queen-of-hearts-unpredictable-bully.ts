import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsUnpredictableBully: CharacterCard = {
  id: "1pq",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Unpredictable Bully",
  fullName: "Queen of Hearts - Unpredictable Bully",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)\nIF I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 95,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de884385b8d6949128ae14c3ed43527359b2d71d",
  },
  abilities: [
    {
      id: "1pq-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
};
