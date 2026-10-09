import type { CharacterCard } from "@tcg/op-types";
import { st24LawBepo004I18n } from "./st24-004-law-bepo.i18n.ts";
export const st24LawBepo004: CharacterCard = {
  id: "ST24-004",
  canonicalId: "ST24-004",
  slug: "law-bepo/st24-004",
  name: "Law & Bepo",
  printings: [
    {
      id: "ST24-004",
      artId: "ST24-004",
      setCode: "ST24",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST24-004.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST24",
  cost: 10,
  traits: ["Minks", "Supernovas", "Heart Pirates"],
  power: 11000,
  attribute: ["slash", "strike"],
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters and that Character will not become active in your opponent's next Refresh Phase. Then, if your opponent has 2 or more rested Characters, your Leader gains +2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            previousActionTargets: true,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
            condition: {
              condition: "zoneCount",
              player: "opponent",
              zone: "character",
              comparison: "gte",
              value: 2,
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st24LawBepo004I18n,
};
