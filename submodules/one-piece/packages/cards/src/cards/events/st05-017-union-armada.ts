import type { EventCard } from "@tcg/op-types";
import { st05UnionArmada017I18n } from "./st05-017-union-armada.i18n.ts";

export const st05UnionArmada017: EventCard = {
  id: "ST05-017",
  canonicalId: "ST05-017",
  slug: "union-armada/st05-017",
  name: "Union Armada",
  printings: [
    {
      id: "ST05-017",
      artId: "ST05-017",
      setCode: "ST05",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-017.png",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 2,
  traits: ["FILM", "The Pirates Fest"],
  effect:
    "[Counter] Up to 1 of your {FILM} type Leader or Character cards gains +4000 power during this battle. If that card is a Character, that Character cannot be K.O.'d during this turn.",
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "exact",
                },
              ],
            },
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            previousActionTargets: true,
            condition: {
              condition: "previousActionTarget",
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: st05UnionArmada017I18n,
};
