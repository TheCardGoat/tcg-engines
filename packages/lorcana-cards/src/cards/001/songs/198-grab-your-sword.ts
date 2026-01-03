import type { ActionCard } from "@tcg/lorcana-types";

export const GrabYourSwordUndefined: ActionCard = {
  id: "u4k",
  cardType: "action",
  name: "Grab Your Sword",
  version: "undefined",
  fullName: "Grab Your Sword - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nDeal 2 damage to each opposing character.",
  cost: 5,
  actionSubtype: "song",
  cardNumber: 198,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  classifications: ["action", "song"],
};
