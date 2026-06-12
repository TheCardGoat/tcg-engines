import type { EventCard } from "@tcg/op-types";
import { op12HairRemovalFist098I18n } from "./098-hair-removal-fist.i18n.ts";

export const op12HairRemovalFist098: EventCard = {
  id: "OP12-098",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 1,
  trigger: "Draw 1 card and trash 1 card from the top of your deck.",
  traits: ["Revolutionary Army Impel Down"],
  effect:
    '[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have a "Revolutionary Army" type Character with a cost of 8 or more, that card gains an additional +2000 power during this battle.',
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op12HairRemovalFist098I18n,
};
