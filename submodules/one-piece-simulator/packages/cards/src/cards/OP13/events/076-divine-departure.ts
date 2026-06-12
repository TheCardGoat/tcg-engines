import type { EventCard } from "@tcg/op-types";
import { op13DivineDeparture076I18n } from "./076-divine-departure.i18n.ts";

export const op13DivineDeparture076: EventCard = {
  id: "OP13-076",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP13",
  cost: 0,
  traits: ["Roger Pirates King of the Pirates"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-076_p1_sBzOJ6b.jpg",
      imageId: "OP13-076_p1",
    },
  ],
  effect:
    "[Main] You may rest 5 of your DON!! cards: If you have any DON!! cards given, give up to 1 of your opponent's Characters 8000 power during this turn.\n[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 8000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
        optional: true,
      },
    ],
  },
  i18n: op13DivineDeparture076I18n,
};
