import type { ItemCard } from "@tcg/lorcana-types";

export const mushusRocket: ItemCard = {
  id: "u0o",
  cardType: "item",
  name: "Mushu's Rocket",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "010",
  text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6c30b03c748da49ccbc01b934795393eacc4820e",
  },
  abilities: [
    {
      id: "u0o-1",
      type: "triggered",
      name: "I NEED FIREPOWER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn.",
    },
    {
      id: "u0o-2",
      type: "activated",
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
      text: "HITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
    },
  ],
};
