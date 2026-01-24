import type { ActionCard } from "@tcg/lorcana-types";

export const soBeIt: ActionCard = {
  id: "7zl",
  cardType: "action",
  name: "So Be It!",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
  cost: 2,
  cardNumber: 94,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1ccae9d2a058bbe7b500eaf114eec2d90af8b144",
  },
  abilities: [
    {
      id: "7zl-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
    },
  ],
};
