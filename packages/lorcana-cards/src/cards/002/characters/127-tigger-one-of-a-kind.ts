import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerOneOfAKind: CharacterCard = {
  id: "1ns",
  cardType: "character",
  name: "Tigger",
  version: "One of a Kind",
  fullName: "Tigger - One of a Kind",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d777770ea1c3e9501c20b77a65e2cfcce67bd0d6",
  },
  abilities: [
    {
      id: "1ns-1",
      type: "triggered",
      name: "ENERGETIC",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Tigger"],
};
