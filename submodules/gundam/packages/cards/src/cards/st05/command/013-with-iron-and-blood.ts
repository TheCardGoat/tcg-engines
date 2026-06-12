import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st05WithIronAndBlood013: CommandCard = {
  cardNumber: "ST05-013",
  name: "With Iron and Blood",
  type: "command",
  color: "purple",
  traits: ["-"],
  id: "ST05-013",
  externalId: "gundam:st05-013",
  slug: "with-iron-and-blood-st05-013",
  displayName: "With Iron and Blood",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-013",
  printings: [
    {
      id: "ST05-013",
      collectorNumber: "ST05-013",
      cardNumber: "ST05-013",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-013.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-013_p1",
      collectorNumber: "ST05-013_p1",
      cardNumber: "ST05-013",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-013_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-013_p2",
      collectorNumber: "ST05-013_p2",
      cardNumber: "ST05-013",
      set: {
        code: "ST05",
        name: "[ST05] Starter Deck Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-013_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-013_p2.webp?260424",
      productName: "[ST05] Starter Deck Release Event",
    },
    {
      id: "ST05-013_p3",
      collectorNumber: "ST05-013_p3",
      cardNumber: "ST05-013",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-013_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-013_p3.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "ST05-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-013.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  effect:
    "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
