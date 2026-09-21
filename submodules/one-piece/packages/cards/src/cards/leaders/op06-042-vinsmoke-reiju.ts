import type { LeaderCard } from "@tcg/op-types";
import { op06VinsmokeReiju042I18n } from "./op06-042-vinsmoke-reiju.i18n.ts";

export const op06VinsmokeReiju042: LeaderCard = {
  id: "OP06-042",
  canonicalId: "OP06-042",
  slug: "vinsmoke-reiju/op06-042",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "OP06-042",
      artId: "OP06-042",
      setCode: "OP06",
      collectorNumber: "042",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-042.jpg",
    },
    {
      id: "OP06-042_p1",
      artId: "OP06-042_p1",
      setCode: "OP06",
      collectorNumber: "042",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-042_p1.jpg",
    },
    {
      id: "OP06-042_p2",
      artId: "OP06-042_p2",
      setCode: "OP06",
      collectorNumber: "042",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-042_p2.jpg",
      label: "Vinsmoke Reiju (SPR)",
    },
  ],
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP06",
  power: 5000,
  life: 4,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",

  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06VinsmokeReiju042I18n,
};
