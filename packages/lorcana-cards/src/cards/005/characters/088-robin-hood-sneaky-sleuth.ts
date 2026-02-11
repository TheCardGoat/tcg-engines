import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSneakySleuth: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "qao-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      id: "qao-2",
      text: "CLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.",
      type: "static",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "5ec6356f453925f30d4ba08d072c6193045d6291",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Sneaky Sleuth",
  id: "qao",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Robin Hood",
  set: "005",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.",
  version: "Sneaky Sleuth",
  willpower: 5,
};
