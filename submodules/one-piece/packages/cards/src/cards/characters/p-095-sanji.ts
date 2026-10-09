import type { CharacterCard } from "@tcg/op-types";
import { pSanji095I18n } from "./p-095-sanji.i18n.ts";
export const pSanji095: CharacterCard = {
  id: "P-095",
  canonicalId: "P-095",
  slug: "sanji/p-095",
  name: "Sanji",
  printings: [
    {
      id: "P-095",
      artId: "P-095",
      setCode: "P",
      collectorNumber: "095",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-095.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  cost: 4,
  counter: 1000,
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] You may trash 1 Event from your hand: Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
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
      },
    ],
  },
  i18n: pSanji095I18n,
};
