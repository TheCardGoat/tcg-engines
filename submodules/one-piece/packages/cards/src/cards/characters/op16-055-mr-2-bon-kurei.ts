import type { CharacterCard } from "@tcg/op-types";
import { op16Mr2BonKurei055I18n } from "./op16-055-mr-2-bon-kurei.i18n.ts";

export const op16Mr2BonKurei055: CharacterCard = {
  id: "OP16-055",
  canonicalId: "OP16-055",
  slug: "mr-2-bon-kurei/op16-055",
  name: "Mr.2.Bon.Kurei",
  printings: [
    {
      id: "OP16-055",
      artId: "OP16-055",
      setCode: "OP16",
      collectorNumber: "055",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-055_ZXMaohf.jpg",
      label: "Mr.2.Bon.Kurei(Bentham) (055)",
    },
    {
      id: "OP16-055_p1",
      artId: "OP16-055_p1",
      setCode: "OP16",
      collectorNumber: "055",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-055_p1_zbCLyxp.jpg",
      label: "Mr.2.Bon.Kurei(Bentham) (055) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP16",
  cost: 2,
  power: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "strike",
  effect:
    "[On Play] Draw 1 card.\n[DON!! x1] [When Attacking] This Character's base power becomes the same as your opponent's Leader's power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
  i18n: op16Mr2BonKurei055I18n,
};
