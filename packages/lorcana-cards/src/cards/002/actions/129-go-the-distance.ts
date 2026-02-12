import type { ActionCard } from "@tcg/lorcana-types";

export const goTheDistance: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1tl-1",
      text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 129,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "eda07f1975c14c7a148e840d0f3693f196882259",
  },
  franchise: "Hercules",
  id: "1tl",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Go the Distance",
  set: "002",
  text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
};
