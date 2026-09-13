import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource063: ResourceCard = {
  cardNumber: "RP-063",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-063",
  canonicalId: "RP-063",
  externalIds: { bandai: "gundam:rp-063" },
  slug: "resource-rp-063",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-063",
  printings: [
    {
      id: "RP-063",
      artId: "RP-063",
      setCode: "RP",
      collectorNumber: "RP-063",
      cardNumber: "RP-063",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-063.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-063",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-063.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
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
