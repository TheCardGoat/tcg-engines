import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Inspector112: CommandCard = {
  cardNumber: "GD04-112",
  name: "Inspector",
  type: "command",
  color: "red",
  traits: ["earth federation", "cyber-newtype"],
  id: "GD04-112",
  canonicalId: "GD04-112",
  externalIds: { bandai: "gundam:gd04-112" },
  slug: "inspector/gd04-112",
  displayName: "Inspector",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-112",
  printings: [
    {
      id: "GD04-112",
      artId: "GD04-112",
      setCode: "GD04",
      collectorNumber: "GD04-112",
      cardNumber: "GD04-112",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-112.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-112"],
  selectedPrintingId: "GD04-112",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-112.webp",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Gates Capa",
  apBonus: 1,
  hpBonus: 1,
  effect: "【Main】Deal 1 damage to all Units that are Lv.2 or lower.\n【Pilot】[Gates Capa]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Deal 1 damage to all Units that are Lv.2 or lower. 【Pilot】[Gates Capa]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
