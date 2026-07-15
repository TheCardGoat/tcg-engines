import type { ActionCard } from "@tcg/lorcana-types";

export const secondStarToTheRight: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 5,
        target: "CHOSEN_PLAYER",
        type: "draw",
      },
      id: "n2q-1",
      text: "Sing Together 10 Chosen player draws 5 cards.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 60,
  cardType: "action",
  cost: 10,
  externalIds: {
    ravensburger: "532a8f3732dd8cc359abafd120e3ee2bb5c9e9b0",
  },
  franchise: "Peter Pan",
  id: "n2q",
  inkType: ["amethyst"],
  inkable: false,
  name: "Second Star to the Right",
  set: "009",
  text: "Sing Together 10 Chosen player draws 5 cards.",
};
