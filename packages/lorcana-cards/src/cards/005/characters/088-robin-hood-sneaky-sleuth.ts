import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSneakySleuth: CharacterCard = {
  id: "qao",
  cardType: "character",
  name: "Robin Hood",
  version: "Sneaky Sleuth",
  fullName: "Robin Hood - Sneaky Sleuth",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 88,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5ec6356f453925f30d4ba08d072c6193045d6291",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};
