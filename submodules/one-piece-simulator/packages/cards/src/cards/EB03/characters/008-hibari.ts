import type { CharacterCard } from "@tcg/op-types";
import { eb03Hibari008I18n } from "./008-hibari.i18n.ts";

export const eb03Hibari008: CharacterCard = {
  id: "EB03-008",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB03",
  cost: 3,
  power: 5000,
  traits: ["Navy SWORD"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-008_p1_feKUzmd.jpg",
      imageId: "EB03-008_p1",
    },
  ],
  effect:
    "[On Play]/[When Attacking] Up to 1 of your {SWORD} type Leader or Character cards can also attack active Characters during this turn.\n[Activate: Main] [Once Per Turn] Give up to 1 of your opponent's Characters 1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "SWORD",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "SWORD",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03Hibari008I18n,
};
