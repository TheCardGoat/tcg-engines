import type { EventCard } from "@tcg/op-types";
import { eb01OffWhite019I18n } from "./019-off-white.i18n.ts";

export const eb01OffWhite019: EventCard = {
  id: "EB01-019",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "EB01",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, look at 3 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb01OffWhite019I18n,
};
