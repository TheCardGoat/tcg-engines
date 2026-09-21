import type { CharacterCard } from "@tcg/op-types";
import { supernovasStrawHat } from "../st01-helpers.ts";
import { st01MonkeyDLuffy012I18n } from "./st01-012-monkey-d-luffy.i18n.ts";

export const st01MonkeyDLuffy012: CharacterCard = {
  id: "ST01-012",
  canonicalId: "ST01-012",
  slug: "monkey-d-luffy/st01-012",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST01-012",
      artId: "ST01-012",
      setCode: "ST01",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012.jpg",
    },
    {
      id: "ST01-012_p1",
      artId: "ST01-012_p1",
      setCode: "ST01",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p1.jpg",
    },
    {
      id: "ST01-012_p2",
      artId: "ST01-012_p2",
      setCode: "ST01",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p2.jpg",
      label: "Monkey.D.Luffy (012) (Alternate Art)",
    },
    {
      id: "ST01-012_p3",
      artId: "ST01-012_p3",
      setCode: "ST01",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p3.jpg",
      label: "Monkey.D.Luffy (012) (Alternate Art) (Gold-Stamped Signature)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST01",
  cost: 5,
  power: 6000,
  traits: supernovasStrawHat,
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [DON!! x2] [When Attacking] Your opponent cannot activate [Blocker] during this battle.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [{ condition: "donAttached", amount: 2 }],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: "all" },
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: st01MonkeyDLuffy012I18n,
};
