import type { ActionCard } from "@tcg/lorcana-types";

export const soBeIt: ActionCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "7zl-1",
      text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
      type: "action",
    },
  ],
  cardNumber: 94,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "1ccae9d2a058bbe7b500eaf114eec2d90af8b144",
  },
  franchise: "Little Mermaid",
  id: "7zl",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "So Be It!",
  set: "010",
  text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
};
