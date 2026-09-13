import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource034: ResourceCard = {
  cardNumber: "RP-034",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-034",
  canonicalId: "RP-034",
  externalIds: { bandai: "gundam:rp-034" },
  slug: "resource-rp-034",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-034",
  printings: [
    {
      id: "RP-034",
      artId: "RP-034",
      setCode: "PB02",
      collectorNumber: "RP-034",
      cardNumber: "RP-034",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-034.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-034",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-034.webp",
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
export const pb02Resource034 = rpResource034;
