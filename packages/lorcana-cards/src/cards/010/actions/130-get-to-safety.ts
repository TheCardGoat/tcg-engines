import type { ActionCard } from "@tcg/lorcana-types";

export const getToSafety: ActionCard = {
  abilities: [
    {
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
      id: "14p-1",
      text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "92c015b81daa806fbc215b39b1b5d351fcc89f3f",
  },
  franchise: "Sleepy Hollow",
  id: "14p",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Get to Safety!",
  set: "010",
  text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
};
