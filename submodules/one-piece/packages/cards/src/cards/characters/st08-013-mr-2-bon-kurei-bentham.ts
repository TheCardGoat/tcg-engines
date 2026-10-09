import type { CharacterCard } from "@tcg/op-types";
import { st08Mr2BonKureiBentham013I18n } from "./st08-013-mr-2-bon-kurei-bentham.i18n.ts";
export const st08Mr2BonKureiBentham013: CharacterCard = {
  id: "ST08-013",
  canonicalId: "ST08-013",
  slug: "mr-2-bon-kurei-bentham/st08-013",
  name: "Mr.2.Bon.Kurei(Bentham)",
  printings: [
    {
      id: "ST08-013",
      artId: "ST08-013",
      setCode: "ST08",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-013.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  cost: 5,
  power: 6000,
  traits: ["Former Baroque Works"],
  attribute: "strike",
  effect:
    "[DON!! x1] At the end of a battle in which this Character battles your opponent's Character, you may K.O. the opponent\u2019s Character you battled with. If you do, K.O. this Character.",
  effects: {
    effects: [
      {
        trigger: "endOfBattle",
        optional: true,
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        eventFilter: {
          battlePowerCompared: true,
          anyOf: [
            {
              sourceSelf: true,
              targetFilters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
            {
              targetSelf: true,
              sourceFilters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
          ],
        },
        actions: [
          {
            action: "ko",
            battleOpponent: true,
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            thenActions: [
              {
                action: "ko",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: {
                    amount: 1,
                  },
                  self: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st08Mr2BonKureiBentham013I18n,
};
