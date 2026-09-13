import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RaiderGundam010: UnitCard = {
  cardNumber: "GD02-010",
  name: "Raider Gundam",
  type: "unit",
  color: "blue",
  battlefieldZones: ["space", "earth"],
  traits: ["earth alliance"],
  id: "GD02-010",
  canonicalId: "GD02-010",
  externalIds: { bandai: "gundam:gd02-010" },
  slug: "raider-gundam/gd02-010",
  displayName: "Raider Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-010",
  printings: [
    {
      id: "GD02-010",
      artId: "GD02-010",
      setCode: "GD02",
      collectorNumber: "GD02-010",
      cardNumber: "GD02-010",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-010.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-010"],
  selectedPrintingId: "GD02-010",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-010.webp",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "(Biological CPU) Trait",
  effect: "【Once per Turn】When this Unit receives enemy effect damage, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onEnemyEffectDamage"],
        conditions: [{ type: "eventCardIsSelf" }],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Once per Turn】When this Unit receives enemy effect damage, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
