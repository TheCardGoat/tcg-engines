import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource058: ResourceCard = {
  cardNumber: "RP-058",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-058",
  canonicalId: "RP-058",
  externalIds: { bandai: "gundam:rp-058" },
  slug: "resource-rp-058",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-058",
  printings: [
    {
      id: "RP-058",
      artId: "RP-058",
      setCode: "RP",
      collectorNumber: "RP-058",
      cardNumber: "RP-058",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-058.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-058",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-058.webp",
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
