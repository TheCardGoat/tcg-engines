import type { ItemCard } from "@tcg/lorcana-types";

export const iceSpikes: ItemCard = {
  id: "k20",
  cardType: "item",
  name: "Ice Spikes",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "008",
  text: "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can’t ready at the start of its next turn.",
  cost: 2,
  cardNumber: 84,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4848962185abb4d5b4c61baa3a86c31313853f72",
  },
  abilities: [
    {
      id: "k20-1",
      type: "triggered",
      name: "HOLD STILL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "HOLD STILL When you play this item, exert chosen opposing character.",
    },
  ],
};
