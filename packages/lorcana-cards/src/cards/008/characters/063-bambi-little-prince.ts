import type { CharacterCard } from "@tcg/lorcana-types";

export const bambiLittlePrince: CharacterCard = {
  id: "cmx",
  cardType: "character",
  name: "Bambi",
  version: "Little Prince",
  fullName: "Bambi - Little Prince",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  text: "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 63,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2d8b5c712524adb131cbf2e2a8bbd3c786353691",
  },
  abilities: [
    {
      id: "cmx-1",
      type: "triggered",
      name: "SAY HELLO",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "SAY HELLO When you play this character, gain 1 lore.",
    },
    {
      id: "cmx-2",
      type: "triggered",
      name: "KIND OF BASHFUL",
      trigger: {
        event: "play",
        timing: "when",
        on: {
          controller: "opponent",
          cardType: "character",
        },
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "KIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
