import type { EventCard } from "@tcg/op-types";
import { op15LightningDragon077I18n } from "./op15-077-lightning-dragon.i18n.ts";

export const op15LightningDragon077: EventCard = {
  id: "OP15-077",
  canonicalId: "OP15-077",
  slug: "lightning-dragon/op15-077",
  name: "Lightning Dragon",
  printings: [
    {
      id: "OP15-077",
      artId: "OP15-077",
      setCode: "OP15",
      collectorNumber: "077",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-077_SgdHMKV.jpg",
    },
    {
      id: "OP15-077_p1",
      artId: "OP15-077_p1",
      setCode: "OP15",
      collectorNumber: "077",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-077_p1_FE0OAy2.jpg",
      label: "Lightning Dragon (Alternate Art)",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP15",
  cost: 0,
  traits: ["Sky Island"],
  effect:
    "[Main] DON!! -1: Draw 1 card. Then, up to 1 of your opponent's rested Characters with 6000 power or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15LightningDragon077I18n,
};
