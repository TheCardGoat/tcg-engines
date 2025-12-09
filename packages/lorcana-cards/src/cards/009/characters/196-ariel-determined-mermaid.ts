import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "3c90f7d78a7f6faad9aeb5edd3c7f5da84a98a4a",
  },
  abilities: [
    {
      id: "gsz-1",
      text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
      name: "I WANT MORE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "song",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
