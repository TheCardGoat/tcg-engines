import type { CharacterCard } from "@tcg/op-types";
import { op16Mr2BonKurei036I18n } from "./op16-036-mr-2-bon-kurei.i18n.ts";

export const op16Mr2BonKurei036: CharacterCard = {
  id: "OP16-036",
  canonicalId: "OP16-036",
  slug: "mr-2-bon-kurei/op16-036",
  name: "Mr.2.Bon.Kurei",
  printings: [
    {
      id: "OP16-036",
      artId: "OP16-036",
      setCode: "OP16",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-036_nIfIUSL.jpg",
      label: "Mr.2.Bon.Kurei(Bentham) (036)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "strike",
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.\n\n[When Attacking] This Character's base power becomes the same as your opponent's Leader during this turn.",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setBasePowerFrom",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            source: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16Mr2BonKurei036I18n,
};
