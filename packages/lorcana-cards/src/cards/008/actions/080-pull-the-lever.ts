import type { ActionCard } from "@tcg/lorcana-types";

export const pullTheLever: ActionCard = {
  id: "ixq",
  cardType: "action",
  name: "Pull the Lever!",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  cost: 3,
  cardNumber: 80,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "443fdfdb48d4bec4a4157b8fa1372ce2ca8187fa",
  },
  abilities: [],
};
