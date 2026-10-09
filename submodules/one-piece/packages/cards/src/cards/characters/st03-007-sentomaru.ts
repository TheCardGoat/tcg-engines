import type { CharacterCard } from "@tcg/op-types";
import { st03Sentomaru007I18n } from "./st03-007-sentomaru.i18n.ts";

export const st03Sentomaru007: CharacterCard = {
  id: "ST03-007",
  canonicalId: "ST03-007",
  slug: "sentomaru/st03-007",
  name: "Sentomaru",
  printings: [
    {
      id: "ST03-007",
      artId: "ST03-007",
      setCode: "ST03",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-007.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["Navy"],
  cost: 3,
  power: 4000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[DON!! x1] [Activate: Main] [Once Per Turn] ➁ (You may rest the specified number of DON!! cards in your cost area.): Play up to 1 [Pacifista] with a cost of 4 or less from your deck, then shuffle your deck.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "deck",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Pacifista",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
            ],
          },
          {
            action: "shuffleDeck",
            player: "self",
          },
        ],
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st03Sentomaru007I18n,
};
