import type { LeaderCard } from "@tcg/op-types";
import { eb02MonkeyDDragon001I18n } from "./001-monkey-d-dragon.i18n.ts";

export const eb02MonkeyDDragon001: LeaderCard = {
  id: "OP07-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 2 total of your currently given DON!! cards to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "redistributeDon",
            count: {
              amount: 2,
              upTo: true,
            },
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02MonkeyDDragon001I18n,
};
