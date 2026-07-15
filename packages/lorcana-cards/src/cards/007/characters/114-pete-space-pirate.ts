import type { CharacterCard } from "@tcg/lorcana-types";

export const peteSpacePirate: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "hmq-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "hmq-2",
      text: "FRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1.",
      type: "static",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Pirate"],
  cost: 6,
  externalIds: {
    ravensburger: "3f8bdad905e5495556f0eee78e68c291fe1c0160",
  },
  fullName: "Pete - Space Pirate",
  id: "hmq",
  inkType: ["emerald", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pete",
  set: "007",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Pete.)\nFRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Space Pirate",
  willpower: 5,
};
