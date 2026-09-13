import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01TaurusSancKingdom033: UnitCard = {
  cardNumber: "EB01-033",
  name: "Taurus (Sanc Kingdom)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-033",
  canonicalId: "EB01-033",
  externalIds: { bandai: "gundam:eb01-033" },
  slug: "taurus-sanc-kingdom-eb01-033",
  displayName: "Taurus (Sanc Kingdom)",
  rulesText:
    "【Activate･Action】【Once per Turn】①：Choose 1 other Unit that is being attacked. It gets AP+1 during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-033",
  printings: [
    {
      id: "EB01-033",
      artId: "EB01-033",
      setCode: "EB01",
      collectorNumber: "EB01-033",
      cardNumber: "EB01-033",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-033.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-033",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-033.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Activate･Action】【Once per Turn】①：Choose 1 other Unit that is being attacked. It gets AP+1 during this battle.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 1,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisBattle",
            target: {
              owner: "any",
              cardType: "unit",
              excludeSource: true,
              isBeingAttacked: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Action】【Once per Turn】①：Choose 1 other Unit that is being attacked. It gets AP+1 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
