import type { ActionCard } from "@tcg/lorcana-types";

export const hakunaMatata: ActionCard = {
  id: "10e",
  cardType: "action",
  name: "Hakuna Matata",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Remove up to 3 damage from each of your characters.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 27,
  inkable: true,
  externalIds: {
    ravensburger: "820f02f5beebca54dc425f38c78f9f8bccea8dea",
  },
  abilities: [
    {
      id: "10e-1",
      text: "Remove up to 3 damage from each of your characters.",
      name: "Hakuna Matata",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        upTo: true,
      },
    },
  ],
};
