import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "5fc0be984dd21402aaebd373ad483414e949646f",
  },
  abilities: [
    {
      id: "qkg-1",
      text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character’s player puts that card on the bottom of their deck.",
      name: "WHAT D'YA SAY?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
