import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01SpConversionChips083: CommandCard = {
  cardNumber: "EB01-083",
  name: "SP Conversion Chips",
  type: "command",
  color: "white",
  traits: [],
  id: "EB01-083",
  canonicalId: "EB01-083",
  externalIds: { bandai: "gundam:eb01-083" },
  slug: "sp-conversion-chips-eb01-083",
  displayName: "SP Conversion Chips",
  rulesText:
    "【Action】If it is your opponent's turn, choose 1 Unit. It gets AP+3 during this turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-083",
  printings: [
    {
      id: "EB01-083",
      artId: "EB01-083",
      setCode: "EB01",
      collectorNumber: "EB01-083",
      cardNumber: "EB01-083",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-083.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-083",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-083.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect: "【Action】If it is your opponent's turn, choose 1 Unit. It gets AP+3 during this turn.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
        conditions: [{ type: "isTurn", whose: "opponent" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisTurn",
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】If it is your opponent's turn, choose 1 Unit. It gets AP+3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
