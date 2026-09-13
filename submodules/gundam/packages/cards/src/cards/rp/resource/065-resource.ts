import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rpResource065: ResourceCard = {
  cardNumber: "RP-065",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "RP-065",
  canonicalId: "RP-065",
  externalIds: { bandai: "gundam:rp-065" },
  slug: "resource-rp-065",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "ST10", name: "Promotion card", packageId: "616901" },
  printNumber: "RP-065",
  printings: [
    {
      id: "RP-065",
      artId: "RP-065",
      setCode: "ST10",
      collectorNumber: "RP-065",
      cardNumber: "RP-065",
      set: { code: "ST10", name: "Promotion card", packageId: "616901" },
      rarity: "promo",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-065.webp",
      productName:
        "Generation Pulse [ST10]/Eternal Nexus[EB01] Release Event Commemorative Items for Participants",
    },
  ],
  selectedPrintingId: "RP-065",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/rp/RP-065.webp",
  legality: "legal",
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
export const st10Resource065 = rpResource065;
