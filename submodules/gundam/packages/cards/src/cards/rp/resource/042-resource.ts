import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource042: ResourceCard = {
  cardNumber: "RP-042",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-042",
  canonicalId: "RP-042",
  externalIds: { bandai: "gundam:rp-042" },
  slug: "resource-rp-042",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-042",
  printings: [
    {
      id: "RP-042",
      artId: "RP-042",
      setCode: "PB02",
      collectorNumber: "RP-042",
      cardNumber: "RP-042",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-042.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-042",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-042.webp",
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
export const pb02Resource042 = rpResource042;
