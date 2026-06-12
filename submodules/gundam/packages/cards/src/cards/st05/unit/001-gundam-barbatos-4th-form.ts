import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st05GundamBarbatos4thForm001: UnitCard = {
  cardNumber: "ST05-001",
  name: "Gundam Barbatos 4th Form",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "ST05-001",
  externalId: "gundam:st05-001",
  slug: "gundam-barbatos-4th-form-st05-001",
  displayName: "Gundam Barbatos 4th Form",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-001",
  printings: [
    {
      id: "ST05-001",
      collectorNumber: "ST05-001",
      cardNumber: "ST05-001",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-001.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-001_p1",
      collectorNumber: "ST05-001_p1",
      cardNumber: "ST05-001",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-001_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-001_p2",
      collectorNumber: "ST05-001_p2",
      cardNumber: "ST05-001",
      set: {
        code: "PC01A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
        packageId: "616701",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-001_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-001_p2.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
    },
  ],
  selectedPrintingId: "ST05-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-001.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "[Mikazuki Augus]",
  effect:
    "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.\nWhile this is damaged, it gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              count: 1,
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "selfIsDamaged" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this is damaged, it gains <Suppression>. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
export const pc01aGundamBarbatos4thForm001 = st05GundamBarbatos4thForm001;
