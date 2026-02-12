import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaScaryBeyondAllReason: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1c0-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      id: "1c0-2",
      name: "CRUEL IRONY",
      text: "CRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 60,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "ad11b54a7e07094083dc887eb31edc68945a31d0",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - Scary Beyond All Reason",
  id: "1c0",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Yzma",
  set: "002",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
  version: "Scary Beyond All Reason",
  willpower: 4,
};
