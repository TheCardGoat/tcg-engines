import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Barzam016: UnitCard = {
  cardNumber: "GD02-016",
  name: "Barzam",
  type: "unit",
  color: "blue",
  battlefieldZones: ["space", "earth"],
  traits: ["titans"],
  id: "GD02-016",
  canonicalId: "GD02-016",
  externalIds: { bandai: "gundam:gd02-016" },
  slug: "barzam/gd02-016",
  displayName: "Barzam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-016",
  printings: [
    {
      id: "GD02-016",
      artId: "GD02-016",
      setCode: "GD02",
      collectorNumber: "GD02-016",
      cardNumber: "GD02-016",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-016.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-016"],
  selectedPrintingId: "GD02-016",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-016.webp",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect: "【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "titans",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
