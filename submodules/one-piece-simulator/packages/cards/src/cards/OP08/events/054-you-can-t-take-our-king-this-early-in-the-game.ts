import type { EventCard } from "@tcg/op-types";
import { op08YouCanTTakeOurKingThisEarlyInTheGame054I18n } from "./054-you-can-t-take-our-king-this-early-in-the-game.i18n.ts";

export const op08YouCanTTakeOurKingThisEarlyInTheGame054: EventCard = {
  id: "OP08-054",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, reveal 1 card from the top of your deck and play up to 1 Character card with a type including "Whitebeard Piratess" and a cost of 3 or less. Then, place the rest at the top or bottom of your deck.',
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
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op08YouCanTTakeOurKingThisEarlyInTheGame054I18n,
};
