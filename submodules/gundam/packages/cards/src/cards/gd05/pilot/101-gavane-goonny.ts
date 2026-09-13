import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05GavaneGoonny101: PilotCard = {
  cardNumber: "GD05-101",
  name: "Gavane Goonny",
  type: "pilot",
  color: "white",
  traits: ["militia"],
  id: "GD05-101",
  canonicalId: "GD05-101",
  externalIds: { bandai: "gundam:gd05-101" },
  slug: "gavane-goonny-gd05-101",
  displayName: "Gavane Goonny",
  rulesText:
    "【Burst】Add this card to your hand.\n【Once per Turn】When you pay ① or more for one of your Unit's effects, if this is a (Militia) Unit, it may recover 2 HP.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-101",
  printings: [
    {
      id: "GD05-101",
      artId: "GD05-101",
      setCode: "GD05",
      collectorNumber: "GD05-101",
      cardNumber: "GD05-101",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-101.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-101",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-101.webp",
  legality: "legal",
  sourceTitle: "∀ Gundam",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Once per Turn】When you pay ① or more for one of your Unit's effects, if this is a (Militia) Unit, it may recover 2 HP.",
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
      type: "triggered",
      activation: {
        timing: ["onUnitEffectCostPaid"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: { owner: "friendly", cardType: "unit" },
          },
          {
            type: "selfHasTrait",
            trait: "militia",
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
            amount: 2,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When you pay ① or more for one of your Unit's effects, if this is a (Militia) Unit, it may recover 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
