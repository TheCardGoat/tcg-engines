import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02AllRangeAttack107: CommandCard = {
  cardNumber: "GD02-107",
  name: "All-Range Attack",
  type: "command",
  color: "red",
  traits: [],
  id: "GD02-107",
  canonicalId: "GD02-107",
  externalIds: { bandai: "gundam:gd02-107" },
  slug: "all-range-attack/gd02-107",
  displayName: "All-Range Attack",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-107",
  printings: [
    {
      id: "GD02-107",
      artId: "GD02-107",
      setCode: "GD02",
      collectorNumber: "GD02-107",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-107.webp",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-107_p1",
      artId: "GD02-107_p1",
      setCode: "GD02",
      collectorNumber: "GD02-107_p1",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-107_p1.webp",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-107_p2",
      artId: "GD02-107_p2",
      setCode: "GD02",
      collectorNumber: "GD02-107_p2",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 3",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-107_p2.webp",
      productName: "Newtype Challenge 2025 Mission 3",
    },
  ],
  reprints: ["GD02-107", "GD02-107_p1", "GD02-107_p2"],
  selectedPrintingId: "GD02-107",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-107.webp",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.<br>【Main】Deal 1 damage to all enemy Units other than Link Units.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
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
              owner: "opponent",
              cardType: "unit",
              isLinkUnit: false,
            },
          },
        },
      ],
      sourceText: "【Main】Deal 1 damage to all enemy Units other than Link Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
