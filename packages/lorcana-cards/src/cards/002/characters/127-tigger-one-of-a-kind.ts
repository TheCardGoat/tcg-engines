import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerOneOfAKind: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1ns-1",
      name: "ENERGETIC",
      text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 127,
  cardType: "character",
  classifications: ["Dreamborn", "Tigger"],
  cost: 3,
  externalIds: {
    ravensburger: "d777770ea1c3e9501c20b77a65e2cfcce67bd0d6",
  },
  franchise: "Winnie the Pooh",
  fullName: "Tigger - One of a Kind",
  id: "1ns",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tigger",
  set: "002",
  strength: 3,
  text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
  version: "One of a Kind",
  willpower: 3,
};
