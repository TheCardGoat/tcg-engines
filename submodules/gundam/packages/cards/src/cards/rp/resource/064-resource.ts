import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource064: ResourceCard = {
  cardNumber: "RP-064",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-064",
  canonicalId: "RP-064",
  externalIds: { bandai: "gundam:rp-064" },
  slug: "resource-rp-064",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-064",
  printings: [
    {
      id: "RP-064",
      artId: "RP-064",
      setCode: "RP",
      collectorNumber: "RP-064",
      cardNumber: "RP-064",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-064.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-064",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-064.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam GQuuuuuuX",
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
