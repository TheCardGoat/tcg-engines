import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamAstrayBlueFrameSecondL018: UnitCard = {
  cardNumber: "EB01-018",
  name: "Gundam Astray Blue Frame Second L",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-018",
  canonicalId: "EB01-018",
  externalIds: { bandai: "gundam:eb01-018" },
  slug: "gundam-astray-blue-frame-second-l-eb01-018",
  displayName: "Gundam Astray Blue Frame Second L",
  rulesText: "【Attack】Choose 1 friendly Unit. It recovers 1 HP.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-018",
  printings: [
    {
      id: "EB01-018",
      artId: "EB01-018",
      setCode: "EB01",
      collectorNumber: "EB01-018",
      cardNumber: "EB01-018",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-018.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-018",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-018.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect: "【Attack】Choose 1 friendly Unit. It recovers 1 HP.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 friendly Unit. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
