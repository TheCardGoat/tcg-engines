import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01BattleOfAces111: CommandCard = {
  cardNumber: "GD01-111",
  name: "Battle of Aces",
  type: "command",
  color: "red",
  traits: ["-"],
  id: "GD01-111",
  externalId: "gundam:gd01-111",
  slug: "battle-of-aces-gd01-111",
  displayName: "Battle of Aces",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-111",
  printings: [
    {
      id: "GD01-111",
      collectorNumber: "GD01-111",
      cardNumber: "GD01-111",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-111.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-111.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-111_p1",
      collectorNumber: "GD01-111_p1",
      cardNumber: "GD01-111",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-111_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-111_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-111_p2",
      collectorNumber: "GD01-111_p2",
      cardNumber: "GD01-111",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-111_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-111_p2.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD01-111_p3",
      collectorNumber: "GD01-111_p3",
      cardNumber: "GD01-111",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-111_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-111_p3.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "GD01-111",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-111.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-111.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  effect:
    "【Burst】Choose 1 enemy Unit. Deal 2 damage to it.<br>【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.<br>",
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
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. Deal 2 damage to it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 3,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
