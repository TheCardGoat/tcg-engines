import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereNimbleCandelabra: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "1k4-1",
      text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 128,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "ca3d3126f63f27a418bd6fd3c21085291bd498d6",
  },
  franchise: "Beauty and the Beast",
  fullName: "Lumiere - Nimble Candelabra",
  id: "1k4",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lumiere",
  set: "008",
  strength: 1,
  text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  version: "Nimble Candelabra",
  willpower: 1,
};
