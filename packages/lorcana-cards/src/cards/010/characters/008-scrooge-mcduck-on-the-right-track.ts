import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckOnTheRightTrack: CharacterCard = {
  id: "ut8",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "On the Right Track",
  fullName: "Scrooge McDuck - On the Right Track",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6f0c3f6e42c972693a108ef21ea2237f1a7b876a",
  },
  abilities: [
    {
      id: "ut8-1",
      type: "triggered",
      name: "FABULOUS WEALTH",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
