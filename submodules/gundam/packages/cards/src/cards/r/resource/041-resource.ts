import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const rResource041: ResourceCard = {
  cardNumber: "R-041",
  name: "Resource",
  type: "resource",
  traits: [],
  id: "R-041",
  canonicalId: "R-041",
  externalIds: { bandai: "gundam:r-041" },
  slug: "resource-r-041",
  displayName: "Resource",
  rulesText: "(Rest a Resource when paying a cost.)",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "R-041",
  printings: [
    {
      id: "R-041",
      artId: "R-041",
      setCode: "ST10",
      collectorNumber: "R-041",
      cardNumber: "R-041",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/r/R-041.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "R-041",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/r/R-041.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
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
  rarity: "common",
};
export const st10Resource041 = rResource041;
