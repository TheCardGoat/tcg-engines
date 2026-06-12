import type { CharacterCard } from "@tcg/op-types";
import { op12Shanks008I18n } from "./008-shanks.i18n.ts";

export const op12Shanks008: CharacterCard = {
  id: "OP12-008",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 6000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-008_p1_XcALa2d.jpg",
      imageId: "OP12-008_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Give up to 1 of your opponent's Leader or Character cards 2000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
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
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12Shanks008I18n,
};
