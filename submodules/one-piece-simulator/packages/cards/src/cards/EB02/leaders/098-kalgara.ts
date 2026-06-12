import type { LeaderCard } from "@tcg/op-types";
import { eb02Kalgara098I18n } from "./098-kalgara.i18n.ts";

export const eb02Kalgara098: LeaderCard = {
  id: "OP08-098",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  effect:
    '[DON!! x1] [When Attacking] Play up to 1 "Shandian Warrior" type Character card from your hand with a cost equal to or less than the number of DON!! cards on your field. If you do, add 1 card from the top of your Life cards to your hand.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "trait",
                value: "Shandian Warrior",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Kalgara098I18n,
};
