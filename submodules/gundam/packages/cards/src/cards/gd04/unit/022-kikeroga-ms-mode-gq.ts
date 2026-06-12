import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04KikerogaMsModeGq022: UnitCard = {
  cardNumber: "GD04-022",
  name: "Kikeroga (MS Mode) (GQ)",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD04-022",
  externalId: "gundam:gd04-022",
  slug: "kikeroga-ms-mode-gq-gd04-022",
  displayName: "Kikeroga (MS Mode) (GQ)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-022",
  printings: [
    {
      id: "GD04-022",
      collectorNumber: "GD04-022",
      cardNumber: "GD04-022",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-022.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-022.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-022_p1",
      collectorNumber: "GD04-022_p1",
      cardNumber: "GD04-022",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-022_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-022_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-022",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-022.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-022.webp?260424",
  legality: "legal",
  level: 7,
  cost: 4,
  ap: 3,
  hp: 6,
  linkCondition: "[Challia Bull]",
  effect:
    "All your Unit tokens gain <Breach 1>.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【During Link】All Units that are Lv.3 or lower other than Unit tokens are deployed rested.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              count: "all",
            },
          },
        },
      ],
      sourceText: "All your Unit tokens gain <Breach 1>.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "deployRested",
            target: {
              owner: "any",
              cardType: "unit",
              isToken: false,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【During Link】All Units that are Lv.3 or lower other than Unit tokens are deployed rested.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
