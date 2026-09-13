import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource060: ResourceCard = {
  cardNumber: "RP-060",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-060",
  canonicalId: "RP-060",
  externalIds: { bandai: "gundam:rp-060" },
  slug: "resource-rp-060",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "RP", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-060",
  printings: [
    {
      id: "RP-060",
      artId: "RP-060",
      setCode: "RP",
      collectorNumber: "RP-060",
      cardNumber: "RP-060",
      set: { code: "RP", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-060.webp",
      productName: "1st Anniversary Resource Card Pack",
    },
  ],
  selectedPrintingId: "RP-060",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-060.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
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
