import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource061: ResourceCard = {
  cardNumber: "RP-061",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-061",
  canonicalId: "RP-061",
  externalIds: { bandai: "gundam:rp-061" },
  slug: "resource-rp-061",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-061",
  printings: [
    {
      id: "RP-061",
      artId: "RP-061",
      setCode: "RP",
      collectorNumber: "RP-061",
      cardNumber: "RP-061",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-061.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-061",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-061.webp",
  legality: "legal",
  sourceTitle: "∀ Gundam",
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
