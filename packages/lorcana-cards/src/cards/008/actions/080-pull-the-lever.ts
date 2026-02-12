import type { ActionCard } from "@tcg/lorcana-types";

export const pullTheLever: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      id: "ixq-2",
      text: "- Draw 2 cards.",
      type: "action",
    },
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      id: "ixq-3",
      text: "- Each opponent chooses and discards a card.",
      type: "action",
    },
  ],
  cardNumber: 80,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "443fdfdb48d4bec4a4157b8fa1372ce2ca8187fa",
  },
  franchise: "Emperors New Groove",
  id: "ixq",
  inkType: ["amethyst", "emerald"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Pull the Lever!",
  set: "008",
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
};
