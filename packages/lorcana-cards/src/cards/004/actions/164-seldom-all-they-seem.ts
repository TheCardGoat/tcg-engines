import type { ActionCard } from "@tcg/lorcana-types";

export const seldomAllTheySeem: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "19i-1",
      text: "Chosen character gets -3 {S} this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 164,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "a42da0e7fb78600ad53ee43454f669e4f312509b",
  },
  franchise: "Sleeping Beauty",
  id: "19i",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Seldom All They Seem",
  set: "004",
  text: "Chosen character gets -3 {S} this turn.",
};
