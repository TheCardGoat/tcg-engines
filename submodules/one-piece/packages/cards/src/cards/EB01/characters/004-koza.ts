import type { CharacterCard } from "@tcg/op-types";
import { eb01Koza004I18n } from "./004-koza.i18n.ts";

export const eb01Koza004: CharacterCard = {
  id: "EB01-004",
  canonicalId: "EB01-004",
  slug: "koza/eb01-004",
  name: "Koza",
  printings: [
    {
      id: "EB01-004",
      artId: "EB01-004",
      setCode: "EB01",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-004.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "ranged",
  effect:
    "[When Attacking] You may give your 1 active Leader -5000 power during this turn: Give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
      },
    ],
  },
  i18n: eb01Koza004I18n,
};
