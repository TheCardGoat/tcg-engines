import type { CharacterCard } from "@tcg/op-types";
import { st23BennBeckman003I18n } from "./st23-003-benn-beckman.i18n.ts";
export const st23BennBeckman003: CharacterCard = {
  id: "ST23-003",
  canonicalId: "ST23-003",
  slug: "benn-beckman/st23-003",
  name: "Benn.Beckman",
  printings: [
    {
      id: "ST23-003",
      artId: "ST23-003",
      setCode: "ST23",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST23-003.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST23",
  cost: 4,
  traits: ["Red-Haired Pirates"],
  power: 5000,
  attribute: "ranged",
  counter: 1000,
  effect:
    "[On Play] You may trash 1 card from your hand: If your Leader has the {Red-Haired Pirates} type, K.O. up to 1 of your opponent's Characters with 4000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Red-Haired Pirates",
              match: "exact",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st23BennBeckman003I18n,
};
