import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaAdventurousSuccessor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "1vb-1",
      name: "I LAUGH IN THE FACE OF DANGER",
      text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 1,
  externalIds: {
    ravensburger: "f366b5591bf174421106ad9ef1b368decafc6ace",
  },
  franchise: "Lion King",
  fullName: "Simba - Adventurous Successor",
  id: "1vb",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Simba",
  set: "005",
  strength: 2,
  text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
  version: "Adventurous Successor",
  willpower: 1,
};
