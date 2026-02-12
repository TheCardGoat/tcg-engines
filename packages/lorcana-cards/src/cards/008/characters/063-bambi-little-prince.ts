import type { CharacterCard } from "@tcg/lorcana-types";

export const bambiLittlePrince: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "cmx-1",
      name: "SAY HELLO",
      text: "SAY HELLO When you play this character, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "cmx-2",
      name: "KIND OF BASHFUL",
      text: "KIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
      trigger: {
        event: "play",
        on: {
          controller: "opponent",
          cardType: "character",
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 63,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "2d8b5c712524adb131cbf2e2a8bbd3c786353691",
  },
  franchise: "Bambi",
  fullName: "Bambi - Little Prince",
  id: "cmx",
  inkType: ["amethyst"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Bambi",
  set: "008",
  strength: 1,
  text: "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
  version: "Little Prince",
  willpower: 1,
};
