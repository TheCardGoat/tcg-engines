import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st04AileStrikeGundam001: UnitCard = {
  cardNumber: "ST04-001",
  name: "Aile Strike Gundam",
  type: "unit",
  color: "white",
  traits: ["earth alliance"],
  id: "ST04-001",
  externalId: "gundam:st04-001",
  slug: "aile-strike-gundam-st04-001",
  displayName: "Aile Strike Gundam",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-001",
  printings: [
    {
      id: "ST04-001",
      collectorNumber: "ST04-001",
      cardNumber: "ST04-001",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-001_p1",
      collectorNumber: "ST04-001_p1",
      cardNumber: "ST04-001",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
    {
      id: "ST04-001_p2",
      collectorNumber: "ST04-001_p2",
      cardNumber: "ST04-001",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST04-001_p3",
      collectorNumber: "ST04-001_p3",
      cardNumber: "ST04-001",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001_p3.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST04-001_p4",
      collectorNumber: "ST04-001_p4",
      cardNumber: "ST04-001",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001_p4.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "ST04-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Kira Yamato]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "level",
          comparison: "gte",
          value: 4,
        },
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "legendRare",
};
export const gd04AileStrikeGundam001 = st04AileStrikeGundam001;
