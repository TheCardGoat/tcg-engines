import type { LeaderCard } from "@tcg/op-types";
import { eb02VinsmokeReiju042I18n } from "./042-vinsmoke-reiju.i18n.ts";

export const eb02VinsmokeReiju042: LeaderCard = {
  id: "OP06-042",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "EB02",
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
  i18n: eb02VinsmokeReiju042I18n,
};
