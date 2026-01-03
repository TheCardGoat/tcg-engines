import type { ActionCard } from "@tcg/lorcana-types";

export const HakunaMatataUndefined: ActionCard = {
  id: "ege",
  cardType: "action",
  name: "Hakuna Matata",
  version: "undefined",
  fullName: "Hakuna Matata - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nRemove up to 3 damage from each of your characters.",
  cost: 4,
  actionSubtype: "song",
  cardNumber: 27,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  classifications: ["action", "song"],
};
