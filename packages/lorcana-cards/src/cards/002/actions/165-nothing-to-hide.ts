import type { ActionCard } from "@tcg/lorcana-types";

export const nothingToHide: ActionCard = {
  id: "1tm",
  cardType: "action",
  name: "Nothing to Hide",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Each opponent reveals their hand. Draw a card.",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  externalIds: {
    ravensburger: "eb38cba8fe1056601e3bcc7c466dba3649d7cb10",
  },
  abilities: [
    {
      id: "1tm-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "Each opponent reveals their hand. Draw a card.",
    },
  ],
};
