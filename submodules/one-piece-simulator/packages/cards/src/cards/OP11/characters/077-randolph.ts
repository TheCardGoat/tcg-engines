import type { CharacterCard } from "@tcg/op-types";
import { op11Randolph077I18n } from "./077-randolph.i18n.ts";

export const op11Randolph077: CharacterCard = {
  id: "OP11-077",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "slash",
  effect:
    '[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, up to 1 of your "Big Mom Pirates" type Characters gains +2 cost until the end of your opponent\'s next turn.',
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
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Big Mom Pirates",
                },
              ],
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Randolph077I18n,
};
