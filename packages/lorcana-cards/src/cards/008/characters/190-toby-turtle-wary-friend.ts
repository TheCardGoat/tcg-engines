import type { CharacterCard } from "@tcg/lorcana-types";

export const tobyTurtleWaryFriend: CharacterCard = {
  id: "1le",
  cardType: "character",
  name: "Toby Turtle",
  version: "Wary Friend",
  fullName: "Toby Turtle - Wary Friend",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "008",
  text: "HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 190,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ceee5141d95bd0a4e22bf7d9d0353bf2e3c36418",
  },
  abilities: [
    {
      id: "1le-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      text: "HARD SHELL While this character is exerted, he gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
