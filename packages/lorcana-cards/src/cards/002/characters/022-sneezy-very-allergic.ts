import type { CharacterCard } from "@tcg/lorcana-types";

export const sneezyVeryAllergic: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1g9-1",
      name: "AH-CHOO!",
      text: "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 2,
  externalIds: {
    ravensburger: "bc68ee273fd86bf9eaf9575f86821dccc6a53e16",
  },
  franchise: "Snow White",
  fullName: "Sneezy - Very Allergic",
  id: "1g9",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Sneezy",
  set: "002",
  strength: 1,
  text: "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
  version: "Very Allergic",
  willpower: 4,
};
