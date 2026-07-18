import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RickDiasRed075: UnitCard = {
  cardNumber: "GD02-075",
  name: "Rick Dias (Red)",
  type: "unit",
  battlefieldZones: ["space", "earth"],
  color: "white",
  traits: ["aeug"],
  id: "GD02-075",
  canonicalId: "GD02-075",
  externalIds: { bandai: "gundam:gd02-075" },
  slug: "rick-dias-red/gd02-075",
  displayName: "Rick Dias (Red)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-075",
  printings: [
    {
      id: "GD02-075",
      artId: "GD02-075",
      setCode: "GD02",
      collectorNumber: "GD02-075",
      cardNumber: "GD02-075",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-075.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-075.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-075"],
  selectedPrintingId: "GD02-075",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-075.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-075.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(AEUG) Trait",
  effect:
    "【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "rest",
              target: {
                owner: "friendly",
                cardType: "base",
                state: "active",
                count: 1,
              },
            },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "statModifier",
                    stat: "ap",
                    amount: -2,
                    duration: "thisBattle",
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
                    },
                  },
                },
              ],
              sourceText:
                "If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.",
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
