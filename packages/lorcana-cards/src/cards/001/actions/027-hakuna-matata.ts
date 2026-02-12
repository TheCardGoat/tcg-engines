import type { ActionCard } from "@tcg/lorcana-types";

export const hakunaMatata: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "10e-1",
      name: "Hakuna Matata",
      text: "Remove up to 3 damage from each of your characters.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 27,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "820f02f5beebca54dc425f38c78f9f8bccea8dea",
  },
  franchise: "Lion King",
  id: "10e",
  inkType: ["amber"],
  inkable: true,
  name: "Hakuna Matata",
  set: "001",
  text: "Remove up to 3 damage from each of your characters.",
};
