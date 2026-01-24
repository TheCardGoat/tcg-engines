import type { CharacterCard } from "@tcg/lorcana-types";

export const peteSpacePirate: CharacterCard = {
  id: "hmq",
  cardType: "character",
  name: "Pete",
  version: "Space Pirate",
  fullName: "Pete - Space Pirate",
  inkType: ["emerald", "steel"],
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Pete.)\nFRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 114,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3f8bdad905e5495556f0eee78e68c291fe1c0160",
  },
  abilities: [
    {
      id: "hmq-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "hmq-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      text: "FRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate"],
};
