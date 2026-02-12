import type { ItemCard } from "@tcg/lorcana-types";

export const mushusRocket: ItemCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "u0o-1",
      name: "I NEED FIREPOWER",
      text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
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
