import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaAdventurousSuccessor: CharacterCard = {
  id: "1vb",
  cardType: "character",
  name: "Simba",
  version: "Adventurous Successor",
  fullName: "Simba - Adventurous Successor",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f366b5591bf174421106ad9ef1b368decafc6ace",
  },
  abilities: [
    {
      id: "1vb-1",
      type: "triggered",
      name: "I LAUGH IN THE FACE OF DANGER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
