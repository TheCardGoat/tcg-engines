import type { StageCard } from "@tcg/op-types";
import { st06NavyHq017I18n } from "./st06-017-navy-hq.i18n.ts";
export const st06NavyHq017: StageCard = {
  id: "ST06-017",
  canonicalId: "ST06-017",
  slug: "navy-hq/st06-017",
  name: "Navy HQ",
  printings: [
    {
      id: "ST06-017",
      artId: "ST06-017",
      setCode: "ST06",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-017.png",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[On Play] Give up to 1 of your opponent's Characters −1 cost during this turn. [Activate: Main] You may rest this Stage: If your Leader has the {Navy} type, give up to 1 of your opponent's Characters −1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Navy",
              match: "exact",
            },
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st06NavyHq017I18n,
};
