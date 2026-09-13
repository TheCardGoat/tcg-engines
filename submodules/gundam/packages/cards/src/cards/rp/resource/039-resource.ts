import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource039: ResourceCard = {
  cardNumber: "RP-039",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-039",
  canonicalId: "RP-039",
  externalIds: { bandai: "gundam:rp-039" },
  slug: "resource-rp-039",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-039",
  printings: [
    {
      id: "RP-039",
      artId: "RP-039",
      setCode: "PB02",
      collectorNumber: "RP-039",
      cardNumber: "RP-039",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-039.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-039",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-039.webp",
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
export const pb02Resource039 = rpResource039;
