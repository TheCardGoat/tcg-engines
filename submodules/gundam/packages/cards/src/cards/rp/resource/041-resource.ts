import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource041: ResourceCard = {
  cardNumber: "RP-041",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-041",
  canonicalId: "RP-041",
  externalIds: { bandai: "gundam:rp-041" },
  slug: "resource-rp-041",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-041",
  printings: [
    {
      id: "RP-041",
      artId: "RP-041",
      setCode: "PB02",
      collectorNumber: "RP-041",
      cardNumber: "RP-041",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-041.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-041",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-041.webp",
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
export const pb02Resource041 = rpResource041;
