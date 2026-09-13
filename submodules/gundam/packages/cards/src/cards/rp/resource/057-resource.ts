import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource057: ResourceCard = {
  cardNumber: "RP-057",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-057",
  canonicalId: "RP-057",
  externalIds: { bandai: "gundam:rp-057" },
  slug: "resource-rp-057",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-057",
  printings: [
    {
      id: "RP-057",
      artId: "RP-057",
      setCode: "RP",
      collectorNumber: "RP-057",
      cardNumber: "RP-057",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-057.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-057",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-057.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Z Gundam",
  level: 0,
  cost: 0,
  effect: "(Rest a Resource when paying a cost.)",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "unparsedText",
            text: "(Rest a Resource when paying a cost.)",
          },
        },
      ],
      sourceText: "(Rest a Resource when paying a cost.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "promo",
};
