import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01MarinaIsmailPtolemaios2087: BaseCard = {
  cardNumber: "EB01-087",
  name: "Marina Ismail & Ptolemaios 2",
  type: "base",
  color: "green",
  traits: ["g generation", "warship"],
  id: "EB01-087",
  canonicalId: "EB01-087",
  externalIds: { bandai: "gundam:eb01-087" },
  slug: "marina-ismail-ptolemaios-2-eb01-087",
  displayName: "Marina Ismail & Ptolemaios 2",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】During your turn, when a friendly green (G Generation) Unit destroys an enemy Unit with battle damage, choose 1 friendly Unit. It recovers 2 HP.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-087",
  printings: [
    {
      id: "EB01-087",
      artId: "EB01-087",
      setCode: "EB01",
      collectorNumber: "EB01-087",
      cardNumber: "EB01-087",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-087.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-087",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-087.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】During your turn, when a friendly green (G Generation) Unit destroys an enemy Unit with battle damage, choose 1 friendly Unit. It recovers 2 HP.",
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
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "color", comparison: "eq", value: "green" },
                { attribute: "trait", comparison: "includes", value: "g generation" },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when a friendly green (G Generation) Unit destroys an enemy Unit with battle damage, choose 1 friendly Unit. It recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
