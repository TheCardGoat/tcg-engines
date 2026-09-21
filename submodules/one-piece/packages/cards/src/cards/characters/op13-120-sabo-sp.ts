import type { CharacterCard } from "@tcg/op-types";
import { op13SaboSp120I18n } from "./op13-120-sabo-sp.i18n.ts";

export const op13SaboSp120: CharacterCard = {
  id: "OP13-120",
  canonicalId: "OP13-120",
  slug: "sabo-sp",
  name: "Sabo",
  printings: [
    {
      id: "OP13-120",
      artId: "OP13-120",
      setCode: "OP13",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_z0pbdkv.jpg",
      label: "Sabo (120) (SP)",
    },
    {
      id: "OP13-120_p4",
      artId: "OP13-120_p4",
      setCode: "OP13",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p4.jpg",
      label: "Sabo (120) (Wanted Poster)",
    },
    {
      id: "OP13-120_p2",
      artId: "OP13-120_p2",
      setCode: "OP13",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p2.jpg",
      label: "Sabo (120) (Super Alternate Art)",
    },
    {
      id: "OP13-120_p3",
      artId: "OP13-120_p3",
      setCode: "OP13",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p3.jpg",
      label: "Sabo (120) (Red Super Alternate Art)",
    },
    {
      id: "OP13-120_p1",
      artId: "OP13-120_p1",
      setCode: "OP13",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p1_2A43PIv.jpg",
      label: "Sabo (120) (Parallel)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] Up to 1 of your Characters gains +2 cost until the end of your opponent's next turn. Then, give up to 1 rested DON!! card to your Leader.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13SaboSp120I18n,
};
