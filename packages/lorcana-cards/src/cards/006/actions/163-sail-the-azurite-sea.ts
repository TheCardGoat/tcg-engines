import type { ActionCard } from "@tcg/lorcana-types";

export const sailTheAzuriteSea: ActionCard = {
  id: "yo2",
  cardType: "action",
  name: "Sail the Azurite Sea",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "006",
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
  cost: 2,
  cardNumber: 163,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7cf280d8897d60a0cb50595020fb50df421ba296",
  },
  abilities: [
    {
      id: "yo2-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
    },
  ],
};
