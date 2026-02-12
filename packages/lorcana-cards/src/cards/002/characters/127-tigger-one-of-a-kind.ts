import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerOneOfAKind: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ns-1",
      name: "ENERGETIC",
      text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
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
