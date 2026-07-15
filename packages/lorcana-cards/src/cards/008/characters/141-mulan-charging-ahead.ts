import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanChargingAhead: CharacterCard = {
  abilities: [
    {
      id: "17c-1",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "17c-2",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "action",
    },
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "17c-3",
      name: "LONG RANGE",
      text: "LONG RANGE This character can challenge ready characters.",
      type: "static",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "9c393a7998141f73d43ba96eda262c943deb3402",
  },
  franchise: "Mulan",
  fullName: "Mulan - Charging Ahead",
  id: "17c",
  inkType: ["ruby", "steel"],
  inkable: false,
  lore: 0,
  missingTests: true,
  name: "Mulan",
  set: "008",
  strength: 3,
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nLONG RANGE This character can challenge ready characters.",
  version: "Charging Ahead",
  willpower: 3,
};
