import type { CharacterCard } from "@tcg/op-types";
import { op17Shiki048I18n } from "./op17-048-shiki.i18n.ts";

export const op17Shiki048: CharacterCard = {
  id: "OP17-048",
  canonicalId: "OP17-048",
  slug: "shiki/op17-048",
  name: "Shiki",
  printings: [
    {
      id: "OP17-048",
      artId: "OP17-048",
      setCode: "OP17",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-048_q65awE1.jpg",
      label: "Shiki (048)",
    },
    {
      id: "OP17-048_p1",
      artId: "OP17-048_p1",
      setCode: "OP17",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-048_p1_zEYWhz7.jpg",
      label: "Shiki (048) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP17",
  cost: 7,
  power: 9000,
  traits: ["Rocks Pirates"],
  attribute: "slash",
  effect:
    "[Rush: Character]\n[When Attacking]/[On Your Opponent's Attack] [Once Per Turn] You may trash 1 cards with a type including \"Rocks Pirates\" from your hand: Give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Rocks Pirates",
                match: "includes",
              },
            ],
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onOpponentAttack:give up to 1 of your opponent's characters -3000 power during this turn.",
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Rocks Pirates",
                match: "includes",
              },
            ],
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onOpponentAttack:give up to 1 of your opponent's characters -3000 power during this turn.",
      },
    ],
  },
  i18n: op17Shiki048I18n,
};
