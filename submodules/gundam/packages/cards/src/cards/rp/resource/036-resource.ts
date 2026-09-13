import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource036: ResourceCard = {
  cardNumber: "RP-036",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-036",
  canonicalId: "RP-036",
  externalIds: { bandai: "gundam:rp-036" },
  slug: "resource-rp-036",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-036",
  printings: [
    {
      id: "RP-036",
      artId: "RP-036",
      setCode: "PB02",
      collectorNumber: "RP-036",
      cardNumber: "RP-036",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-036.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-036",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-036.webp",
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
export const pb02Resource036 = rpResource036;
