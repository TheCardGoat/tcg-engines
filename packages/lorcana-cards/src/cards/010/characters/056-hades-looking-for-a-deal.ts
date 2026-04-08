import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLookingForADeal: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          chooser: "OPPONENT",
          optionLabels: [
            "Put that character on the bottom of their deck",
            "Controller draws 2 cards",
          ],
          options: [
            {
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "opponent",
                selector: "chosen",
                zones: ["play"],
              },
              type: "put-on-bottom",
            },
            {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
          type: "choice",
        },
        type: "optional",
      },
      id: "qkg-1",
      name: "WHAT D'YA SAY?",
      text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 56,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 5,
  externalIds: {
    ravensburger: "5fc0be984dd21402aaebd373ad483414e949646f",
  },
  franchise: "Hercules",
  fullName: "Hades - Looking for a Deal",
  id: "qkg",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Hades",
  set: "010",
  strength: 3,
  text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
  version: "Looking for a Deal",
  willpower: 4,
};
