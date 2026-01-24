import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganVeryLargeMouse: CharacterCard = {
  id: "1wj",
  cardType: "character",
  name: "Ratigan",
  version: "Very Large Mouse",
  fullName: "Ratigan - Very Large Mouse",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 121,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f70a88424f6eced04d922558f866b8c6a4774eed",
  },
  abilities: [
    {
      id: "1wj-1",
      type: "triggered",
      name: "THIS IS MY KINGDOM",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
