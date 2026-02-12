import type { ActionCard } from "@tcg/lorcana-types";

export const nothingToHide: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "1tm-1",
      text: "Each opponent reveals their hand. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 165,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "eb38cba8fe1056601e3bcc7c466dba3649d7cb10",
  },
  franchise: "Beauty and the Beast",
  id: "1tm",
  inkType: ["sapphire"],
  inkable: true,
  name: "Nothing to Hide",
  set: "002",
  text: "Each opponent reveals their hand. Draw a card.",
};
