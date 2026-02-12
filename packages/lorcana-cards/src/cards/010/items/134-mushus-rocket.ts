import type { ItemCard } from "@tcg/lorcana-types";

export const mushusRocket: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "u0o-1",
      name: "I NEED FIREPOWER",
      text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "u0o-2",
      text: "HITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  cardNumber: 134,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "6c30b03c748da49ccbc01b934795393eacc4820e",
  },
  franchise: "Mulan",
  id: "u0o",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Mushu's Rocket",
  set: "010",
  text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
};
