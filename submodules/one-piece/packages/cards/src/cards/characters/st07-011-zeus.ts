import type { CharacterCard } from "@tcg/op-types";
import { st07Zeus011I18n } from "./st07-011-zeus.i18n.ts";
export const st07Zeus011: CharacterCard = {
  id: "ST07-011",
  canonicalId: "ST07-011",
  slug: "zeus/st07-011",
  name: "Zeus",
  printings: [
    {
      id: "ST07-011",
      artId: "ST07-011",
      setCode: "ST07",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-011.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 3,
  traits: ["Big Mom Pirates", "Homies"],
  power: 3000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your [Charlotte Linlin] cards gains [Banish] during this turn.(When this card deals damage, the target card is trashed without activating its Trigger.)",
  trigger: "[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Charlotte Linlin",
                },
              ],
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st07Zeus011I18n,
};
