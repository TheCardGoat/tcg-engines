import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st05McgillisSchwalbeGraze007: UnitCard = {
  cardNumber: "ST05-007",
  name: "McGillis' Schwalbe Graze",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn"],
  id: "ST05-007",
  externalId: "gundam:st05-007",
  slug: "mcgillis-schwalbe-graze-st05-007",
  displayName: "McGillis' Schwalbe Graze",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-007",
  printings: [
    {
      id: "ST05-007",
      collectorNumber: "ST05-007",
      cardNumber: "ST05-007",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-007.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-007_p1",
      collectorNumber: "ST05-007_p1",
      cardNumber: "ST05-007",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-007_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-007_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-007_p2",
      collectorNumber: "ST05-007_p2",
      cardNumber: "ST05-007",
      set: {
        code: "PC01A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
        packageId: "616701",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-007_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-007_p2.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
    },
  ],
  selectedPrintingId: "ST05-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-007.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  linkCondition: "[McGillis Fareed]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "legendRare",
};
export const pc01aMcgillisSchwalbeGraze007 = st05McgillisSchwalbeGraze007;
