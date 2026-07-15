import type { ItemCard } from "@tcg/lorcana-types";

export const iceSpikes: ItemCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "k20-1",
      name: "HOLD STILL",
      text: "HOLD STILL When you play this item, exert chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 84,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "4848962185abb4d5b4c61baa3a86c31313853f72",
  },
  franchise: "Frozen",
  id: "k20",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Ice Spikes",
  set: "008",
  text: "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can’t ready at the start of its next turn.",
};
