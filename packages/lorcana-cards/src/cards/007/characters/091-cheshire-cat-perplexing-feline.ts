import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatPerplexingFeline: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "16n-1",
      name: "MAD GRIN",
      text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 5,
  externalIds: {
    ravensburger: "99b060c09b5134d9107f78d08e2018d615658a7c",
  },
  franchise: "Alice in Wonderland",
  fullName: "Cheshire Cat - Perplexing Feline",
  id: "16n",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cheshire Cat",
  set: "007",
  strength: 4,
  text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
  version: "Perplexing Feline",
  willpower: 3,
};
