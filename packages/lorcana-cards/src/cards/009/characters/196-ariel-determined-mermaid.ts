import type { CharacterCard } from "@tcg/lorcana-types";

export const arielDeterminedMermaid: CharacterCard = {
  abilities: [
    {
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
      id: "gsz-1",
      name: "I WANT MORE",
      text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 196,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "3c90f7d78a7f6faad9aeb5edd3c7f5da84a98a4a",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Determined Mermaid",
  id: "gsz",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ariel",
  set: "009",
  strength: 2,
  text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
  version: "Determined Mermaid",
  willpower: 4,
};
