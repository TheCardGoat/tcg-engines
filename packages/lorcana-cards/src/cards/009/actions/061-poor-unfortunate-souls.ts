import type { ActionCard } from "@tcg/lorcana-types";

export const poorUnfortunateSouls: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "return-to-hand",
      },
      id: "1ti-1",
      text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 61,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "ed007086370af05d97b329a2a69bacfeebcf26e7",
  },
  franchise: "Little Mermaid",
  id: "1ti",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Poor Unfortunate Souls",
  set: "009",
  text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
};
