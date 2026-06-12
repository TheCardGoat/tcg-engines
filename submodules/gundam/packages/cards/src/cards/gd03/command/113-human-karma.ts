import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03HumanKarma113: CommandCard = {
  cardNumber: "GD03-113",
  name: "Human Karma",
  type: "command",
  color: "red",
  traits: [],
  id: "GD03-113",
  externalId: "gundam:gd03-113",
  slug: "human-karma-gd03-113",
  displayName: "Human Karma",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-113",
  printings: [
    {
      id: "GD03-113",
      collectorNumber: "GD03-113",
      cardNumber: "GD03-113",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-113.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-113.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-113_p1",
      collectorNumber: "GD03-113_p1",
      cardNumber: "GD03-113",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-113_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-113_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD03-113_p2",
      collectorNumber: "GD03-113_p2",
      cardNumber: "GD03-113",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-113_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-113_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD03-113",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-113.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-113.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  effect:
    "【Main】/【Action】Choose 1 active friendly Unit. Rest it. If you do, choose 1 enemy Unit whose Lv. is equal to or lower than the Unit rested with this ability. Deal 3 damage to it.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "dealDamageByChosenUnitLevel",
            amount: 3,
            referenceTarget: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 active friendly Unit. Rest it. If you do, choose 1 enemy Unit whose Lv. is equal to or lower than the Unit rested with this ability. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
