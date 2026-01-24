import type { ActionCard } from "@tcg/lorcana-types";

export const evilComesPrepared: ActionCard = {
  id: "1qd",
  cardType: "action",
  name: "Evil Comes Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  cost: 2,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0cea4262def4296207693e1e943c8c7c29b4591",
  },
  abilities: [
    {
      id: "1qd-1",
      type: "action",
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
      text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
    },
  ],
};
