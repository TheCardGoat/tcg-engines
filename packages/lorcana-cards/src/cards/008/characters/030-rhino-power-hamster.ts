import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoPowerHamster: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "g5c-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 2,
      },
      id: "g5c-2",
      text: "EPIC BALL OF AWESOME While this character has no damage, he gains Resist +2.",
      type: "static",
    },
  ],
  cardNumber: 30,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "3a337ffd94c21fe5bf8f6715b2e18fbd69b158fc",
  },
  franchise: "Bolt",
  fullName: "Rhino - Power Hamster",
  id: "g5c",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rhino",
  set: "008",
  strength: 4,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)\nEPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  version: "Power Hamster",
  willpower: 3,
};
