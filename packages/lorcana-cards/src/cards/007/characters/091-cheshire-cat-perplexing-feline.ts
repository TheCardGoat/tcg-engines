import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatPerplexingFeline: CharacterCard = {
  id: "16n",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Perplexing Feline",
  fullName: "Cheshire Cat - Perplexing Feline",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "99b060c09b5134d9107f78d08e2018d615658a7c",
  },
  abilities: [
    {
      id: "16n-1",
      type: "triggered",
      name: "MAD GRIN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn"],
};
