import type { CharacterCard } from "@tcg/op-types";
import { op09MarshallDTeach093I18n } from "./op09-093-marshall-d-teach.i18n.ts";

export const op09MarshallDTeach093: CharacterCard = {
  id: "OP09-093",
  canonicalId: "OP09-093",
  slug: "marshall-d-teach/op09-093",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP09-093",
      artId: "OP09-093",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093.jpg",
    },
    {
      id: "OP09-093_p1",
      artId: "OP09-093_p1",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p1.jpg",
    },
    {
      id: "OP09-093_p2",
      artId: "OP09-093_p2",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p2.jpg",
    },
    {
      id: "OP09-093_p3",
      artId: "OP09-093_p3",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p3.jpg",
    },
    {
      id: "OP09-093_p4",
      artId: "OP09-093_p4",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p4_yGd9lfW.jpg",
      label: "Marshall.D.Teach (SP) (Silver)",
    },
    {
      id: "OP09-093_p5",
      artId: "OP09-093_p5",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p5_esui2Sk.jpg",
    },
    {
      id: "OP09-093_r3",
      artId: "OP09-093_r3",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_r3.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP09",
  cost: 10,
  power: 12000,
  traits: ["Blackbeard Pirates The Four Emperors"],
  attribute: "special",

  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] If your Leader has the \"Blackbeard Pirates\" type and this Character was played on this turn, negate the effect of up to 1 of your opponent's Leader during this turn. Then, negate the effect of up to 1 of your opponent's Characters and that Character cannot attack until the end of your opponent's next turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Blackbeard Pirates",
                match: "includes",
              },
              {
                condition: "playedThisTurn",
              },
            ],
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "untilEndOfOpponentNextTurn",
            previousActionTargets: true,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09MarshallDTeach093I18n,
};
