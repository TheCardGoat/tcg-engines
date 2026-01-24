import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoPowerHamster: CharacterCard = {
  id: "g5c",
  cardType: "character",
  name: "Rhino",
  version: "Power Hamster",
  fullName: "Rhino - Power Hamster",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)\nEPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 30,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a337ffd94c21fe5bf8f6715b2e18fbd69b158fc",
  },
  abilities: [
    {
      id: "g5c-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "g5c-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 2,
      },
      text: "EPIC BALL OF AWESOME While this character has no damage, he gains Resist +2.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
