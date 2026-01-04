import type { ActionCard } from "@tcg/lorcana-types";

export const Reflection: ActionCard = {
  id: "brz",
  cardType: "action",
  name: "Reflection",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  cost: 1,
  actionSubtype: "song",
  cardNumber: 65,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
      id: "brz-1",
      effect: {
        type: "look-at-cards",
        amount: 3,
        from: "top-of-deck",
        target: "CONTROLLER",
      },
    },
  ],
};
