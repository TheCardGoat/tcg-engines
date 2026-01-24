import type { CharacterCard } from "@tcg/lorcana-types";

export const arielDeterminedMermaid: CharacterCard = {
  id: "gsz",
  cardType: "character",
  name: "Ariel",
  version: "Determined Mermaid",
  fullName: "Ariel - Determined Mermaid",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 196,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c90f7d78a7f6faad9aeb5edd3c7f5da84a98a4a",
  },
  abilities: [
    {
      id: "gsz-1",
      type: "triggered",
      name: "I WANT MORE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
