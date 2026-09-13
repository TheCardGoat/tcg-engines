import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource038: ResourceCard = {
  cardNumber: "RP-038",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-038",
  canonicalId: "RP-038",
  externalIds: { bandai: "gundam:rp-038" },
  slug: "resource-rp-038",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
  printNumber: "RP-038",
  printings: [
    {
      id: "RP-038",
      artId: "RP-038",
      setCode: "PB02",
      collectorNumber: "RP-038",
      cardNumber: "RP-038",
      set: { code: "PB02", name: "Other Product Card", packageId: "616701" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-038.webp",
      productName: "Premium Accessory Set -Mobile Suit Gundam IRON-BLOODED ORPHANS- [PB02]",
    },
  ],
  selectedPrintingId: "RP-038",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-038.webp",
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
export const pb02Resource038 = rpResource038;
