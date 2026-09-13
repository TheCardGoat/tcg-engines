import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01MiorineRembranAcademyShip088: BaseCard = {
  cardNumber: "EB01-088",
  name: "Miorine Rembran & Academy Ship",
  type: "base",
  color: "green",
  traits: ["g generation", "warship"],
  id: "EB01-088",
  canonicalId: "EB01-088",
  externalIds: { bandai: "gundam:eb01-088" },
  slug: "miorine-rembran-academy-ship-eb01-088",
  displayName: "Miorine Rembran & Academy Ship",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nAll friendly (G Generation) Units that are Lv.3 get AP+1 during your opponent's turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-088",
  printings: [
    {
      id: "EB01-088",
      artId: "EB01-088",
      setCode: "EB01",
      collectorNumber: "EB01-088",
      cardNumber: "EB01-088",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-088.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-088",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-088.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nAll friendly (G Generation) Units that are Lv.3 get AP+1 during your opponent's turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "isTurn", whose: "opponent" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "g generation" },
                { attribute: "level", comparison: "eq", value: 3 },
              ],
            },
          },
        },
      ],
      sourceText:
        "All friendly (G Generation) Units that are Lv.3 get AP+1 during your opponent's turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
