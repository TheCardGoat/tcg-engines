import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01DarylLorenz070: PilotCard = {
  cardNumber: "EB01-070",
  name: "Daryl Lorenz",
  type: "pilot",
  color: "white",
  traits: ["g generation", "support"],
  id: "EB01-070",
  canonicalId: "EB01-070",
  externalIds: { bandai: "gundam:eb01-070" },
  slug: "daryl-lorenz-eb01-070",
  displayName: "Daryl Lorenz",
  rulesText:
    "【Burst】Add this card to your hand.\n【During Link】【Activate･Action】【Once per Turn】①：If it is your opponent's turn, choose 1 Unit. It gets AP+1 during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-070",
  printings: [
    {
      id: "EB01-070",
      artId: "EB01-070",
      setCode: "EB01",
      collectorNumber: "EB01-070",
      cardNumber: "EB01-070",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-070.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-070",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-070.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Activate･Action】【Once per Turn】①：If it is your opponent's turn, choose 1 Unit. It gets AP+1 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        conditions: [
          {
            type: "duringLink",
          },
          {
            type: "isTurn",
            whose: "opponent",
          },
        ],
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
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Action】【Once per Turn】①：If it is your opponent's turn, choose 1 Unit. It gets AP+1 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
