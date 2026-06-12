import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st04AegisGundam006: UnitCard = {
  cardNumber: "ST04-006",
  name: "Aegis Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "ST04-006",
  externalId: "gundam:st04-006",
  slug: "aegis-gundam-st04-006",
  displayName: "Aegis Gundam",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-006",
  printings: [
    {
      id: "ST04-006",
      collectorNumber: "ST04-006",
      cardNumber: "ST04-006",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-006.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-006_p1",
      collectorNumber: "ST04-006_p1",
      cardNumber: "ST04-006",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-006_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST04-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-006.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Athrun Zala]",
  effect:
    "【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "selfStat",
            stat: "ap",
            comparison: "gte",
            value: 5,
          },
        ],
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
              attributeFilters: [{ attribute: "level", comparison: "gte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
