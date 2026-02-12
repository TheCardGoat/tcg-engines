import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganVeryLargeMouse: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "1wj-1",
      name: "THIS IS MY KINGDOM",
      text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "f70a88424f6eced04d922558f866b8c6a4774eed",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan - Very Large Mouse",
  id: "1wj",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Ratigan",
  set: "002",
  strength: 3,
  text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
  version: "Very Large Mouse",
  willpower: 3,
};
