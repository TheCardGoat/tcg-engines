import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource062: ResourceCard = {
  cardNumber: "RP-062",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-062",
  canonicalId: "RP-062",
  externalIds: { bandai: "gundam:rp-062" },
  slug: "resource-rp-062",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-062",
  printings: [
    {
      id: "RP-062",
      artId: "RP-062",
      setCode: "RP",
      collectorNumber: "RP-062",
      cardNumber: "RP-062",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-062.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-062",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-062.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam AGE",
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
