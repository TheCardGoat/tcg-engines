import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DraculeMihawkManga119I18n } from "./119-dracule-mihawk-manga.i18n.ts";

export const op14eb04DraculeMihawkManga119: CharacterCard = {
  id: "OP14-119",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP14EB04",
  cost: 9,
  power: 10000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-119_OkSnUtV.jpg",
      imageId: "OP14-119",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-119_p1_msFsNgZ.jpg",
      imageId: "OP14-119_p1",
    },
  ],
  effect:
    "[Your Turn] When this Character becomes rested, up to 1 of your opponent's Characters with a cost of 9 or less cannot be rested until the end of your opponent's next End Phase.[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 9,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
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
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04DraculeMihawkManga119I18n,
};
