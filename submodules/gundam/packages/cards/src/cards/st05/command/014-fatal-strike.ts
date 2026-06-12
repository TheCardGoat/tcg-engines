import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st05FatalStrike014: CommandCard = {
  cardNumber: "ST05-014",
  name: "Fatal Strike",
  type: "command",
  color: "purple",
  traits: ["-"],
  id: "ST05-014",
  externalId: "gundam:st05-014",
  slug: "fatal-strike-st05-014",
  displayName: "Fatal Strike",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-014",
  printings: [
    {
      id: "ST05-014",
      collectorNumber: "ST05-014",
      cardNumber: "ST05-014",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-014_p1",
      collectorNumber: "ST05-014_p1",
      cardNumber: "ST05-014",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-014_p2",
      collectorNumber: "ST05-014_p2",
      cardNumber: "ST05-014",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014_p2.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST05-014_p3",
      collectorNumber: "ST05-014_p3",
      cardNumber: "ST05-014",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014_p3.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST05-014_p4",
      collectorNumber: "ST05-014_p4",
      cardNumber: "ST05-014",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014_p4.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "ST05-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-014.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.<br>【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "destroy",
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
      sourceText: "【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
