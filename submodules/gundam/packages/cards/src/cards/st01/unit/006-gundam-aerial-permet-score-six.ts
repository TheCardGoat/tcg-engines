import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st01GundamAerialPermetScoreSix006: UnitCard = {
  cardNumber: "ST01-006",
  name: "Gundam Aerial (Permet Score Six)",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "ST01-006",
  externalId: "gundam:st01-006",
  slug: "gundam-aerial-permet-score-six-st01-006",
  displayName: "Gundam Aerial (Permet Score Six)",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-006",
  printings: [
    {
      id: "ST01-006",
      collectorNumber: "ST01-006",
      cardNumber: "ST01-006",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-006.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-006_p1",
      collectorNumber: "ST01-006_p1",
      cardNumber: "ST01-006",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-006_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST01-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-006.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Suletta Mercury]",
  effect:
    "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
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
            amount: -3,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
