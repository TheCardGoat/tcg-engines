import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08Gundam001: UnitCard = {
  cardNumber: "ST08-001",
  name: "Ξ Gundam",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "ST08-001",
  externalId: "gundam:st08-001",
  slug: "gundam-st08-001",
  displayName: "Ξ Gundam",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-001",
  printings: [
    {
      id: "ST08-001",
      collectorNumber: "ST08-001",
      cardNumber: "ST08-001",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-001.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-001_p1",
      collectorNumber: "ST08-001_p1",
      cardNumber: "ST08-001",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-001_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-001.webp?260424",
  legality: "legal",
  level: 9,
  cost: 8,
  ap: 5,
  hp: 5,
  linkCondition: "[Hathaway Noa]",
  effect:
    "While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each enemy Unit in play.\n【When Paired】Choose 1 enemy Unit with the highest Lv. Deal 3 damage to it.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            comparison: "eq",
            count: 0,
            attributeFilters: [{ attribute: "level", comparison: "gte", value: 6 }],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: 1,
            countFilter: {
              owner: "opponent",
              cardType: "unit",
              zone: "battleArea",
            },
            target: {
              owner: "self",
              cardType: "unit",
              zone: "hand",
            },
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 1,
            countFilter: {
              owner: "opponent",
              cardType: "unit",
              zone: "battleArea",
            },
            target: {
              owner: "self",
              cardType: "unit",
              zone: "hand",
            },
          },
        },
      ],
      sourceText:
        "While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each enemy Unit in play.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 3,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              highest: "level",
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit with the highest Lv. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
