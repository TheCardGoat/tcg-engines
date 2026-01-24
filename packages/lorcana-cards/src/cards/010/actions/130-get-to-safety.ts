import type { ActionCard } from "@tcg/lorcana-types";

export const getToSafety: ActionCard = {
  id: "14p",
  cardType: "action",
  name: "Get to Safety!",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
  cost: 1,
  cardNumber: 130,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "92c015b81daa806fbc215b39b1b5d351fcc89f3f",
  },
  abilities: [
    {
      id: "14p-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a location named Sleepy Hollow in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
    },
  ],
};
