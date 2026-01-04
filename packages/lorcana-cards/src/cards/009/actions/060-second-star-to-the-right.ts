import type { ActionCard } from "@tcg/lorcana-types";

export const secondStarToTheRight: ActionCard = {
  id: "n2q",
  cardType: "action",
  name: "Second Star to the Right",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "009",
  text: "Sing Together 10 Chosen player draws 5 cards.",
  actionSubtype: "song",
  cost: 10,
  cardNumber: 60,
  inkable: false,
  externalIds: {
    ravensburger: "532a8f3732dd8cc359abafd120e3ee2bb5c9e9b0",
  },
  abilities: [
    {
      id: "n2q-1",
      text: "Sing Together 10 Chosen player draws 5 cards.",
      type: "action",
      effect: {
        type: "draw",
        amount: 5,
        target: "CHOSEN_PLAYER",
      },
    },
  ],
};
