import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource043: ResourceCard = {
  cardNumber: "RP-043",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-043",
  canonicalId: "RP-043",
  externalIds: { bandai: "gundam:rp-043" },
  slug: "resource-rp-043",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-043",
  printings: [
    {
      id: "RP-043",
      artId: "RP-043",
      setCode: "PB02",
      collectorNumber: "RP-043",
      cardNumber: "RP-043",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-043.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-043",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-043.webp",
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
export const pb02Resource043 = rpResource043;
