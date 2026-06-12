import type { EventCard } from "@tcg/op-types";
import { op09MurderAtTheSteamBath059I18n } from "./059-murder-at-the-steam-bath.i18n.ts";

export const op09MurderAtTheSteamBath059: EventCard = {
  id: "OP09-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 2,
  trigger: "Draw 1 card.",
  traits: ["Buggy Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, trash up to 2 cards from your hand. Trash the same number of cards from the top of your deck as you did from your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op09MurderAtTheSteamBath059I18n,
};
