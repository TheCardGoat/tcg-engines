import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource040: ResourceCard = {
  cardNumber: "RP-040",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-040",
  canonicalId: "RP-040",
  externalIds: { bandai: "gundam:rp-040" },
  slug: "resource-rp-040",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-040",
  printings: [
    {
      id: "RP-040",
      artId: "RP-040",
      setCode: "PB02",
      collectorNumber: "RP-040",
      cardNumber: "RP-040",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-040.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-040",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-040.webp",
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
export const pb02Resource040 = rpResource040;
