import type { ActionCard } from "@tcg/lorcana-types";

export const reflection: ActionCard = {
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          { zone: "deck-top", remainder: true, ordering: "player-choice" },
        ],
      },
      id: "brz-1",
      text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 65,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "brz",
  inkType: ["amethyst"],
  inkable: true,
  name: "Reflection",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
};
