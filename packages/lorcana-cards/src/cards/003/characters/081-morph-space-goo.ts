import type { CharacterCard } from "@tcg/lorcana-types";

export const morphSpaceGoo: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "vo5-1",
      text: "MIMICRY You may play any character with Shift on this character as if this character had any name.",
      type: "static",
    },
  ],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Alien"],
  cost: 2,
  externalIds: {
    ravensburger: "7224e6e62fbce5a57e8680667aef2f012bf27b3b",
  },
  franchise: "Treasure Planet",
  fullName: "Morph - Space Goo",
  id: "vo5",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Morph",
  set: "003",
  strength: 2,
  text: "MIMICRY You may play any character with Shift on this character as if this character had any name.",
  version: "Space Goo",
  willpower: 1,
};
