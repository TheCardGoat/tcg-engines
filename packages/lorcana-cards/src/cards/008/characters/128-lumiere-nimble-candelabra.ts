import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereNimbleCandelabra: CharacterCard = {
  id: "1k4",
  cardType: "character",
  name: "Lumiere",
  version: "Nimble Candelabra",
  fullName: "Lumiere - Nimble Candelabra",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ca3d3126f63f27a418bd6fd3c21085291bd498d6",
  },
  abilities: [
    {
      id: "1k4-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
