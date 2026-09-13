import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource059: ResourceCard = {
  cardNumber: "RP-059",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-059",
  canonicalId: "RP-059",
  externalIds: { bandai: "gundam:rp-059" },
  slug: "resource-rp-059",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-059",
  printings: [
    {
      id: "RP-059",
      artId: "RP-059",
      setCode: "RP",
      collectorNumber: "RP-059",
      cardNumber: "RP-059",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-059.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-059",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-059.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
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
