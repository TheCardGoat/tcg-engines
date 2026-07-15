import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelUnwaveringSchemer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1l4-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
  ],
  cardNumber: 92,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "cdbf26f3c024f49ca1be07d416db32bede4c8d3b",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Unwavering Schemer",
  id: "1l4",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Mother Gothel",
  set: "005",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)\nTHE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
  version: "Unwavering Schemer",
  willpower: 6,
};
