import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st05McgillisFareed012: PilotCard = {
  cardNumber: "ST05-012",
  name: "McGillis Fareed",
  type: "pilot",
  color: "white",
  traits: ["gjallarhorn"],
  id: "ST05-012",
  externalId: "gundam:st05-012",
  slug: "mcgillis-fareed-st05-012",
  displayName: "McGillis Fareed",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-012",
  printings: [
    {
      id: "ST05-012",
      collectorNumber: "ST05-012",
      cardNumber: "ST05-012",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-012.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-012_p1",
      collectorNumber: "ST05-012_p1",
      cardNumber: "ST05-012",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-012_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST05-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-012.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: ["gjallarhorn", "tekkadan"],
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
