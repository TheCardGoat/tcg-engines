import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLookingForADeal: CharacterCard = {
  id: "qkg",
  cardType: "character",
  name: "Hades",
  version: "Looking for a Deal",
  fullName: "Hades - Looking for a Deal",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "010",
  text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character’s player puts that card on the bottom of their deck.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5fc0be984dd21402aaebd373ad483414e949646f",
  },
  abilities: [
    {
      id: "qkg-1",
      type: "triggered",
      name: "WHAT D'YA SAY?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
        ],
      },
      text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character’s player puts that card on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
