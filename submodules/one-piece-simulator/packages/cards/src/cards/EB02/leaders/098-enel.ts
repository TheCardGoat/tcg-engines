import type { LeaderCard } from "@tcg/op-types";
import { eb02Enel098I18n } from "./098-enel.i18n.ts";

export const eb02Enel098: LeaderCard = {
  id: "OP05-098",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [Once Per Turn] When your number of Life cards becomes 0, add 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb02Enel098I18n,
};
