import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaScaryBeyondAllReason: CharacterCard = {
  id: "1c0",
  cardType: "character",
  name: "Yzma",
  version: "Scary Beyond All Reason",
  fullName: "Yzma - Scary Beyond All Reason",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "ad11b54a7e07094083dc887eb31edc68945a31d0",
  },
  abilities: [
    {
      id: "1c0-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1c0-2",
      type: "triggered",
      name: "CRUEL IRONY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "CRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
