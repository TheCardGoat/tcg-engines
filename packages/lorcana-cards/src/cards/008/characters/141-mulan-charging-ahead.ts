import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanChargingAhead: CharacterCard = {
  id: "17c",
  cardType: "character",
  name: "Mulan",
  version: "Charging Ahead",
  fullName: "Mulan - Charging Ahead",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nLONG RANGE This character can challenge ready characters.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 0,
  cardNumber: 141,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9c393a7998141f73d43ba96eda262c943deb3402",
  },
  abilities: [
    {
      id: "17c-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
    {
      id: "17c-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
    },
    {
      id: "17c-3",
      type: "static",
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      name: "LONG RANGE",
      text: "LONG RANGE This character can challenge ready characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
