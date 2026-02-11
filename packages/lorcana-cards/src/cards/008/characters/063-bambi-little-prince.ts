import type { CharacterCard } from "@tcg/lorcana-types";

export const bambiLittlePrince: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "cmx-1",
      name: "SAY HELLO",
      text: "SAY HELLO When you play this character, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "cmx-2",
      name: "KIND OF BASHFUL",
      text: "KIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: {
          controller: "opponent",
          cardType: "character",
        },
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
