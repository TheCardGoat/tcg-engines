import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaExasperatedSchemer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "5wn-1",
      name: "HOW SHALL I DO IT?",
      text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 101,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "1549f70d69d265a807a772bbb979f346c7040f6a",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - Exasperated Schemer",
  id: "5wn",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Yzma",
  set: "007",
  strength: 2,
  text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
  version: "Exasperated Schemer",
  willpower: 2,
};
