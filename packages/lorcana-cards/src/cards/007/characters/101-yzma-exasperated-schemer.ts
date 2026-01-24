import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaExasperatedSchemer: CharacterCard = {
  id: "5wn",
  cardType: "character",
  name: "Yzma",
  version: "Exasperated Schemer",
  fullName: "Yzma - Exasperated Schemer",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 101,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1549f70d69d265a807a772bbb979f346c7040f6a",
  },
  abilities: [
    {
      id: "5wn-1",
      type: "triggered",
      name: "HOW SHALL I DO IT?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
      text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
