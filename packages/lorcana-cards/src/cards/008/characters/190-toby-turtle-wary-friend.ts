import type { CharacterCard } from "@tcg/lorcana-types";

export const tobyTurtleWaryFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "1le-1",
      text: "HARD SHELL While this character is exerted, he gains Resist +1.",
      type: "static",
    },
  ],
  cardNumber: 190,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "ceee5141d95bd0a4e22bf7d9d0353bf2e3c36418",
  },
  franchise: "Robin Hood",
  fullName: "Toby Turtle - Wary Friend",
  id: "1le",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Toby Turtle",
  set: "008",
  strength: 0,
  text: "HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Wary Friend",
  willpower: 4,
};
