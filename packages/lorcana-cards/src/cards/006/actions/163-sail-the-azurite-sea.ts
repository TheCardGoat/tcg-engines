import type { ActionCard } from "@tcg/lorcana-types";

export const sailTheAzuriteSea: ActionCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          facedown: true,
        },
        type: "optional",
      },
      id: "yo2-1",
      text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 163,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "7cf280d8897d60a0cb50595020fb50df421ba296",
  },
  franchise: "Lorcana",
  id: "yo2",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Sail the Azurite Sea",
  set: "006",
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
};
