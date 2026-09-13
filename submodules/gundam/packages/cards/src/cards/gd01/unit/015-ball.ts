import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Ball015: UnitCard = {
  cardNumber: "GD01-015",
  name: "Ball",
  type: "unit",
  battlefieldZones: ["space"],
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-015",
  canonicalId: "GD01-015",
  externalIds: { bandai: "gundam:gd01-015" },
  slug: "ball/gd01-015",
  displayName: "Ball",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-015",
  printings: [
    {
      id: "GD01-015",
      artId: "GD01-015",
      setCode: "GD01",
      collectorNumber: "GD01-015",
      cardNumber: "GD01-015",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-015.webp",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-015_p1",
      artId: "GD01-015_p1",
      setCode: "BETA",
      collectorNumber: "GD01-015_p1",
      cardNumber: "GD01-015",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/beta/GD01-015_p1.webp",
      productName: "Edition Beta",
    },
  ],
  reprints: ["GD01-015", "GD01-015_p1"],
  selectedPrintingId: "GD01-015",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-015.webp",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 1,
  hp: 1,
  effect: "【Attack】Choose 1 of your Units. It recovers 1 HP.<br>",
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
      sourceText: "【Attack】Choose 1 of your Units. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
