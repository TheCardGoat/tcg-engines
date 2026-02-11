import type { ActionCard } from "@tcg/lorcana-types";

export const evilComesPrepared: ActionCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "a Villain character is chosen",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      id: "1qd-1",
      text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 128,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "e0cea4262def4296207693e1e943c8c7c29b4591",
  },
  franchise: "Lion King",
  id: "1qd",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Evil Comes Prepared",
  set: "005",
  text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
};
