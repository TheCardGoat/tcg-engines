import type { ActionCard } from "@tcg/lorcana-types";

export const bosssOrders: ActionCard = {
  id: "117",
  cardType: "action",
  name: "Boss's Orders",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 25,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "deffeb7558c071d16437d9c45b4569955f49c12c",
  },
  abilities: [
    {
      id: "117-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "Chosen character gains Support this turn.",
    },
  ],
};
