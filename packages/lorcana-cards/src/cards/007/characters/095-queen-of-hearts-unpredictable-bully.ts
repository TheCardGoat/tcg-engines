import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsUnpredictableBully: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1pq-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
  ],
  cardNumber: 95,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen"],
  cost: 5,
  externalIds: {
    ravensburger: "de884385b8d6949128ae14c3ed43527359b2d71d",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Unpredictable Bully",
  id: "1pq",
  inkType: ["emerald", "ruby"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Queen of Hearts",
  set: "007",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)\nIF I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.",
  version: "Unpredictable Bully",
  willpower: 6,
};
