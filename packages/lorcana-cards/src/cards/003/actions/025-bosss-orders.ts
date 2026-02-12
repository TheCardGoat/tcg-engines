import type { ActionCard } from "@tcg/lorcana-types";

export const bosssOrders: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "117-1",
      text: "Chosen character gains Support this turn.",
      type: "action",
    },
  ],
  cardNumber: 25,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "deffeb7558c071d16437d9c45b4569955f49c12c",
  },
  franchise: "Rescuers",
  id: "117",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Boss's Orders",
  set: "003",
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};
