import type { ActionCard } from "@tcg/lorcana-types";

export const poorUnfortunateSouls: ActionCard = {
  id: "1ti",
  cardType: "action",
  name: "Poor Unfortunate Souls",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 61,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed007086370af05d97b329a2a69bacfeebcf26e7",
  },
  abilities: [
    {
      id: "1ti-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
    },
  ],
};
