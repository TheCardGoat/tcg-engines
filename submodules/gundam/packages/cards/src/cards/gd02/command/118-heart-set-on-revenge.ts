import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02HeartSetOnRevenge118: CommandCard = {
  cardNumber: "GD02-118",
  name: "Heart Set on Revenge",
  type: "command",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-118",
  externalId: "gundam:gd02-118",
  slug: "heart-set-on-revenge-gd02-118",
  displayName: "Heart Set on Revenge",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-118",
  printings: [
    {
      id: "GD02-118",
      collectorNumber: "GD02-118",
      cardNumber: "GD02-118",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-118.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-118.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-118",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-118.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-118.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Ein Dalton",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 enemy Unit with 4 or less HP battling a friendly Unit with &lt;Blocker&gt;. Return it to its owner's hand.<br>【Pilot】[Ein Dalton]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 4,
                },
              ],
              // "battling a friendly Unit with <Blocker>" — the
              // <Blocker> keyword lives on the OTHER combatant (the
              // friendly unit), not on the enemy target. Expressed via
              // the relational `isBattling.opponentMatches` sub-filter,
              // which constrains the other combatant to a friendly unit
              // that currently has <Blocker>.
              isBattling: {
                opponentMatches: {
                  owner: "friendly",
                  cardType: "unit",
                  hasKeyword: "Blocker",
                },
              },
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 enemy Unit with 4 or less HP battling a friendly Unit with <Blocker>. Return it to its owner's hand. 【Pilot】[Ein Dalton]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
