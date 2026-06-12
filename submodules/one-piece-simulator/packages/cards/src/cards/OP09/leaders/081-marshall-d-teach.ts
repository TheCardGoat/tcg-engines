import type { LeaderCard } from "@tcg/op-types";
import { op09MarshallDTeach081I18n } from "./081-marshall-d-teach.i18n.ts";

export const op09MarshallDTeach081: LeaderCard = {
  id: "OP09-081",
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 5,
  traits: ["Blackbeard Pirates The Four Emperors"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-081_p1.jpg",
      imageId: "OP09-081_p1",
    },
  ],
  effect:
    "Your [On Play] effects are negated.\n[Activate: Main] You may trash 1 card from your hand: Your opponent's [On Play] effects are negated until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilEndOfOpponentNextTurn",
            effectTypes: ["onPlay"],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09MarshallDTeach081I18n,
};
