import type { CharacterCard } from "@tcg/lorcana-types";

export const RapunzelGiftedWithHealing: CharacterCard = {
  id: "kro",
  cardType: "character",
  name: "Rapunzel",
  version: "Gifted with Healing",
  fullName: "Rapunzel - Gifted with Healing",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "kro-1",
      text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 3,
            upTo: true,
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};
