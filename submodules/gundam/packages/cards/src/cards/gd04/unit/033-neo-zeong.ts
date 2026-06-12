import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04NeoZeong033: UnitCard = {
  cardNumber: "GD04-033",
  name: "Neo Zeong",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD04-033",
  externalId: "gundam:gd04-033",
  slug: "neo-zeong-gd04-033",
  displayName: "Neo Zeong",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-033",
  printings: [
    {
      id: "GD04-033",
      collectorNumber: "GD04-033",
      cardNumber: "GD04-033",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-033.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-033.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-033_p1",
      collectorNumber: "GD04-033_p1",
      cardNumber: "GD04-033",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-033_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-033_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-033",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-033.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-033.webp?260424",
  legality: "legal",
  level: 9,
  cost: 8,
  ap: 6,
  hp: 7,
  linkCondition: "[Full Frontal]",
  effect:
    "When this Unit or one of your (Neo Zeon) Units is deployed, choose 1 enemy Unit. Deal 3 damage to it.\n【During Link】All your Units gain (Neo Zeon).",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "neo zeon" }],
            },
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
            },
          },
        },
      ],
      sourceText:
        "When this Unit or one of your (Neo Zeon) Units is deployed, choose 1 enemy Unit. Deal 3 damage to it.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "grantTrait",
            trait: "neo zeon",
            duration: "whileLinked",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
            },
          },
        },
      ],
      sourceText: "【During Link】All your Units gain (Neo Zeon).",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
