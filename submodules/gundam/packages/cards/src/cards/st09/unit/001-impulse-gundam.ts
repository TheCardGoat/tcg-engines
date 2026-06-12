import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09ImpulseGundam001: UnitCard = {
  cardNumber: "ST09-001",
  name: "Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "ST09-001",
  externalId: "gundam:st09-001",
  slug: "impulse-gundam-st09-001",
  displayName: "Impulse Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-001",
  printings: [
    {
      id: "ST09-001",
      collectorNumber: "ST09-001",
      cardNumber: "ST09-001",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-001.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-001_p1",
      collectorNumber: "ST09-001_p1",
      cardNumber: "ST09-001",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-001_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-001.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Shinn Asuka]",
  effect:
    '【Activate･Main】②, return this Unit to the bottom of its owner\'s deck：Choose 1 Unit card with "Impulse Gundam" in its card name that is Lv.4 or higher from your trash. Deploy it.',
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        payResources: 2,
      },
      directives: [
        {
          action: {
            action: "returnToDeck",
            position: "bottom",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Impulse Gundam",
                },
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        '【Activate·Main】②, return this Unit to the bottom of its owner\'s deck：Choose 1 Unit card with "Impulse Gundam" in its card name that is Lv.4 or higher from your trash. Deploy it.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
