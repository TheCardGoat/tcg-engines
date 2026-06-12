import type { EventCard } from "@tcg/op-types";
import { op11GumGumKingCobra059I18n } from "./059-gum-gum-king-cobra.i18n.ts";

export const op11GumGumKingCobra059: EventCard = {
  id: "OP11-059",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  trigger: "Return up to 1 Character with a cost of 2 or less to the owner's hand.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 4 or less cards in your hand, that card gains an additional +2000 power during this battle.",
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
  i18n: op11GumGumKingCobra059I18n,
};
