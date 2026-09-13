import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource035: ResourceCard = {
  cardNumber: "RP-035",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-035",
  canonicalId: "RP-035",
  externalIds: { bandai: "gundam:rp-035" },
  slug: "resource-rp-035",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-035",
  printings: [
    {
      id: "RP-035",
      artId: "RP-035",
      setCode: "PB02",
      collectorNumber: "RP-035",
      cardNumber: "RP-035",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-035.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-035",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-035.webp",
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
export const pb02Resource035 = rpResource035;
