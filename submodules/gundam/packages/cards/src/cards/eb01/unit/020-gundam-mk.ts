import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamMk020: UnitCard = {
  cardNumber: "EB01-020",
  name: "Gundam Mk-Ⅲ",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-020",
  canonicalId: "EB01-020",
  externalIds: { bandai: "gundam:eb01-020" },
  slug: "gundam-mk-eb01-020",
  displayName: "Gundam Mk-Ⅲ",
  rulesText: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-020",
  printings: [
    {
      id: "EB01-020",
      artId: "EB01-020",
      setCode: "EB01",
      collectorNumber: "EB01-020",
      cardNumber: "EB01-020",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-020.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-020",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-020.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 2,
  linkCondition: "(Durability) Trait",
  battlefieldZones: ["space", "earth"],
  effect: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
