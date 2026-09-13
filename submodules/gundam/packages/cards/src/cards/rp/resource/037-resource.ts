import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource037: ResourceCard = {
  cardNumber: "RP-037",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-037",
  canonicalId: "RP-037",
  externalIds: { bandai: "gundam:rp-037" },
  slug: "resource-rp-037",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-037",
  printings: [
    {
      id: "RP-037",
      artId: "RP-037",
      setCode: "PB02",
      collectorNumber: "RP-037",
      cardNumber: "RP-037",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-037.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-037",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-037.webp",
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
export const pb02Resource037 = rpResource037;
