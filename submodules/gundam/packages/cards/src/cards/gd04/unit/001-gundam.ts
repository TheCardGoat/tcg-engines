import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam001: UnitCard = {
  cardNumber: "GD04-001",
  name: "Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD04-001",
  canonicalId: "GD04-001",
  externalIds: { bandai: "gundam:gd04-001" },
  slug: "gundam/gd04-001",
  displayName: "Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-001",
  printings: [
    {
      id: "GD04-001",
      artId: "GD04-001",
      setCode: "GD04",
      collectorNumber: "GD04-001",
      cardNumber: "GD04-001",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-001.webp",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-001_p1",
      artId: "GD04-001_p1",
      setCode: "GD04",
      collectorNumber: "GD04-001_p1",
      cardNumber: "GD04-001",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-001_p1.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-001", "GD04-001_p1"],
  selectedPrintingId: "GD04-001",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-001.webp",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 6,
  hp: 3,
  linkCondition: "[Amuro Ray]",
  effect:
    "【During Link】【Attack】If you are attacking an enemy Unit, you may return a blue Pilot paired with this Unit to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringLink" },
          { type: "isAttackingUnit" },
          { type: "selfPairedPilotHasColor", color: "blue" },
        ],
      },
      directives: [
        {
          condition: { type: "isAttackingUnit" },
          thenDirectives: [
            { action: { action: "returnPairedPilotToHand", color: "blue" }, optional: true },
          ],
        },
      ],
      sourceText:
        "【During Link】【Attack】If you are attacking an enemy Unit, you may return a blue Pilot paired with this Unit to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
