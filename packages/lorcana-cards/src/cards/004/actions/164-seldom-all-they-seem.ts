import type { ActionCard } from "@tcg/lorcana-types";

export const seldomAllTheySeem: ActionCard = {
  id: "19i",
  cardType: "action",
  name: "Seldom All They Seem",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Chosen character gets -3 {S} this turn.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 164,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a42da0e7fb78600ad53ee43454f669e4f312509b",
  },
  abilities: [
    {
      id: "19i-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "Chosen character gets -3 {S} this turn.",
    },
  ],
};
