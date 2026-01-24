import type { ActionCard } from "@tcg/lorcana-types";

export const goTheDistance: ActionCard = {
  id: "1tl",
  cardType: "action",
  name: "Go the Distance",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "002",
  text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eda07f1975c14c7a148e840d0f3693f196882259",
  },
  abilities: [
    {
      id: "1tl-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
    },
  ],
};
