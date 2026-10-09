import type { EventCard } from "@tcg/op-types";
import { st14GumGumDiableThreeSwordsStyleMoutenJetSixHundredPoundPhoenixCannon015I18n } from "./st14-015-gum-gum-diable-three-swords-style-mouten-jet-six-hundred-pound-phoenix-cannon.i18n.ts";
export const st14GumGumDiableThreeSwordsStyleMoutenJetSixHundredPoundPhoenixCannon015: EventCard = {
  id: "ST14-015",
  canonicalId: "ST14-015",
  slug: "gum-gum-diable-three-swords-style-mouten-jet-six-hundred-pound-phoenix-cannon/st14-015",
  name: "Gum-Gum Diable Three-Swords Style Mouten Jet Six Hundred Pound Phoenix Cannon",
  printings: [
    {
      id: "ST14-015",
      artId: "ST14-015",
      setCode: "ST14",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-015.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 2,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, if you have a Character with a cost of 8 or more, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: 3000,
            duration: "thisTurn",
          },
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  trigger:
    "[Trigger] If you have a Character with a cost of 8 or more, K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  i18n: st14GumGumDiableThreeSwordsStyleMoutenJetSixHundredPoundPhoenixCannon015I18n,
};
