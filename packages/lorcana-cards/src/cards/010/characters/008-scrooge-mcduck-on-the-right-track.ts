import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckOnTheRightTrack: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "ut8-1",
      name: "FABULOUS WEALTH",
      text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "6f0c3f6e42c972693a108ef21ea2237f1a7b876a",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - On the Right Track",
  id: "ut8",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "010",
  strength: 4,
  text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
  version: "On the Right Track",
  willpower: 3,
};
